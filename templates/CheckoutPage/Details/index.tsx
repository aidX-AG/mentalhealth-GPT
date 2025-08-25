import Icon from "@/components/Icon";

type DetailsProps = {
  tierName: string;            // "Enterprise"
  popularLabel: string;        // "Popular"
  priceAmount: string;         // "$399"
  pricePeriod: string;         // "Monthly Plan"
  features: string[];          // Liste der Bullet-Points
};

const Details = ({
  tierName,
  popularLabel,
  priceAmount,
  pricePeriod,
  features,
}: DetailsProps) => (
  <>
    <div className="flex justify-between items-center mb-1">
      <div className="h5 text-[#139843]">{tierName}</div>
      <div className="shrink-0 ml-4 px-3 py-0.5 bg-[#FF97E8] rounded caption1 font-semibold text-n-7">
        {popularLabel}
      </div>
    </div>
    <div className="base1 font-semibold">
      {priceAmount}
      <span className="ml-4 text-n-4">{pricePeriod}</span>
    </div>
    <div className="mt-8 pt-8 space-y-5 border-t border-n-4/25 lg:hidden">
      {features.map((x, index) => (
        <div className="flex base2" key={index}>
          <Icon className="mr-3 fill-primary-1" name="check-circle" />
          {x}
        </div>
      ))}
    </div>
  </>
);

export default Details;
