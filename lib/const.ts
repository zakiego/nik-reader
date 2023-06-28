export const Feature = ["read", "predict"] as const;
export type Feature = (typeof Feature)[number];

export const NIK_LENGTH = 16;
