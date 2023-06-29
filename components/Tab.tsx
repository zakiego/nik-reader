import { Dispatch, FC, SetStateAction } from "react";
import { Feature } from "~/lib/const";

interface Props {
  selectedTab: Feature;
  setSelectedTab: Dispatch<SetStateAction<Feature>>;
}

export const Tab: FC<Props> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="mt-8 bg-hitam-50 flex items-center rounded-2xl">
      {Feature.map((tab) => (
        <div key={tab} className="py-1.5 px-1.5 w-1/2 text-center">
          <button
            onClick={() => {
              setSelectedTab(tab);
            }}
            className={`${
              selectedTab === tab
                ? "text-hitam-900/90 font-bold bg-white shadow-lg "
                : "text-hitam-900/50"
            }
						w-full transition-all py-1 text-lg rounded-2xl hover:text-hitam-900/90 hover:font-bold hover:bg-white hover:shadow-lg `}
          >
            {tab === "read" ? "Baca" : "Generate"}
          </button>
        </div>
      ))}
    </div>
  );
};
