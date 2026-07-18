import type { UserProfile } from "./profile";

export interface FormFieldSnapshot {
  uid: string;
  tag: string;
  type: string;
  name: string;
  id: string;
  autocomplete: string;
  placeholder: string;
  label: string;
  ariaLabel: string;
}

export type FillMap = Record<string, string>;

type ProfileKey = keyof UserProfile;

const RULES: { keys: RegExp[]; profileKey: ProfileKey }[] = [
  {
    keys: [
      /^(email|e-mail|mail)$/i,
      /email|e-mail|อีเมล|อีเมล์/,
    ],
    profileKey: "email",
  },
  {
    keys: [/phone|mobile|tel|โทร|เบอร์/, /^(tel|phone)$/i],
    profileKey: "phone",
  },
  {
    keys: [/first\s*name|fname|given\s*name|ชื่อ(?!\s*สกุล)/],
    profileKey: "firstName",
  },
  {
    keys: [/last\s*name|lname|surname|family\s*name|นามสกุล/],
    profileKey: "lastName",
  },
  {
    keys: [/full\s*name|your\s*name|display\s*name|ชื่อ-นามสกุล|ชื่อจริง/],
    profileKey: "fullName",
  },
  {
    keys: [/^name$/i, /ชื่อ$/],
    profileKey: "fullName",
  },
  {
    keys: [/address\s*2|addr2|street2|ที่อยู่\s*2|แขวง|ตำบล/],
    profileKey: "address2",
  },
  {
    keys: [/address|street|addr1|ที่อยู่|บ้านเลขที่/],
    profileKey: "address1",
  },
  {
    keys: [/city|town|เมือง|อำเภอ|เขต/],
    profileKey: "city",
  },
  {
    keys: [/state|province|region|จังหวัด/],
    profileKey: "state",
  },
  {
    keys: [/zip|postal|postcode|รหัสไปรษณีย์/],
    profileKey: "postalCode",
  },
  {
    keys: [/country|ประเทศ/],
    profileKey: "country",
  },
  {
    keys: [/company|organization|org|บริษัท|องค์กร/],
    profileKey: "company",
  },
  {
    keys: [/job\s*title|title|position|ตำแหน่ง/],
    profileKey: "jobTitle",
  },
  {
    keys: [/linkedin/],
    profileKey: "linkedin",
  },
  {
    keys: [/website|portfolio|url|เว็บไซต์/],
    profileKey: "website",
  },
  {
    keys: [/summary|bio|about|cover\s*letter|แนะนำตัว|ประวัติ/],
    profileKey: "summary",
  },
  {
    keys: [/card\s*name|name\s*on\s*card|ชื่อบนบัตร/],
    profileKey: "cardName",
  },
  {
    keys: [/card\s*number|cc-number|credit\s*card|เลขบัตร/],
    profileKey: "cardNumber",
  },
  {
    keys: [/expir|cc-exp|valid\s*thru|วันหมดอายุ/],
    profileKey: "cardExp",
  },
  {
    keys: [/cvc|cvv|security\s*code|รหัสหลังบัตร/],
    profileKey: "cardCvc",
  },
];

function haystack(field: FormFieldSnapshot): string {
  return [
    field.label,
    field.ariaLabel,
    field.name,
    field.id,
    field.placeholder,
    field.autocomplete,
    field.type,
  ]
    .join(" ")
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function matchProfileKey(field: FormFieldSnapshot): ProfileKey | null {
  const text = haystack(field);

  // Strong autocomplete hints first
  const ac = field.autocomplete.toLowerCase();
  const acMap: Record<string, ProfileKey> = {
    email: "email",
    tel: "phone",
    "tel-national": "phone",
    "given-name": "firstName",
    "family-name": "lastName",
    name: "fullName",
    "street-address": "address1",
    "address-line1": "address1",
    "address-line2": "address2",
    "address-level2": "city",
    "address-level1": "state",
    "postal-code": "postalCode",
    country: "country",
    "country-name": "country",
    organization: "company",
    "cc-name": "cardName",
    "cc-number": "cardNumber",
    "cc-exp": "cardExp",
    "cc-csc": "cardCvc",
    url: "website",
  };
  if (ac && acMap[ac]) return acMap[ac];

  if (field.type === "email") return "email";
  if (field.type === "tel") return "phone";
  if (field.type === "url") return "website";

  for (const rule of RULES) {
    if (rule.keys.some((re) => re.test(text))) return rule.profileKey;
  }
  return null;
}

/** Fast local fill — no network. */
export function heuristicFill(
  fields: FormFieldSnapshot[],
  profile: UserProfile,
): FillMap {
  const map: FillMap = {};
  for (const field of fields) {
    const key = matchProfileKey(field);
    if (!key) continue;
    const value = profile[key]?.trim();
    if (!value) continue;
    map[field.uid] = value;
  }
  return map;
}

export function profileToPromptBlock(profile: UserProfile): string {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(profile).filter(([, v]) => String(v).trim().length > 0),
    ),
    null,
    2,
  );
}
