/**
 * Region option lists for the "Generate NIK" dropdowns, resolved in the browser.
 *
 * `~/lib/region` eagerly imports the ~550 KB datasets, so importing it straight
 * from a component would ship all of it in the initial bundle. Going through a
 * dynamic `import()` instead lets webpack split it into a lazy `_next/static`
 * chunk (~50 KB brotli) that is fetched once, on first use, and served from the
 * CDN — which is why the cascade no longer needs a query per level.
 *
 * `~/utils/read` loads the same module, so a visitor who reads a NIK and then
 * opens the generator pays for the chunk only once.
 */

export type RegionOption = { value: string; label: string };

const loadRegion = () => import("~/lib/region");

export const loadProvinsiOptions = async (): Promise<RegionOption[]> => {
  const { listProvinsi } = await loadRegion();

  return listProvinsi().map((p) => ({ value: p.idProv, label: p.name }));
};

export const loadKabupatenOptions = async (
  idProv: string,
): Promise<RegionOption[]> => {
  const { listKabupaten } = await loadRegion();

  return listKabupaten(idProv).map((k) => ({ value: k.idKab, label: k.name }));
};

export const loadKecamatanOptions = async (
  idKab: string,
): Promise<RegionOption[]> => {
  const { listKecamatan } = await loadRegion();

  return listKecamatan(idKab).map((k) => ({
    value: k.idKec,
    label: k.name.toUpperCase(),
  }));
};
