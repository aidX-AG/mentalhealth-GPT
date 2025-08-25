import FaqItem from "@/components/FaqItem";

type FaqItemType = {
  id: string;
  title: string;
  content: string;
  defaultOpen?: boolean;
};

type Props = {
  title: string;
  items: FaqItemType[];
};

const Faq = ({ title, items }: Props) => (
  <div className="py-32 px-15 2xl:py-20 2xl:px-10 xl:px-8 dark:bg-n-7/25">
    <div className="max-w-[47.75rem] mx-auto">
      <div className="mb-12 text-center h3 lg:h4">{title}</div>
      <div>
        {items.map((x) => (
          <FaqItem item={x} key={x.id} />
        ))}
      </div>
    </div>
  </div>
);

export default Faq;
