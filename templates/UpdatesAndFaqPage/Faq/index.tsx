import FaqItem from "@/components/FaqItem";
import Image from "@/components/Image";

type FaqItemType = {
  id: string;
  title: string;
  content: string;
  defaultOpen: boolean;
};

type Props = {
  items: FaqItemType[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
};

const Faq = ({ items, ctaTitle, ctaSubtitle, ctaButtonLabel }: Props) => (
  <>
    <div>
      {items.map((x) => (
        <FaqItem item={x} key={x.id} />
      ))}
    </div>

    <div className="mt-12 p-20 bg-n-2/50 rounded-[1.25rem] text-center md:py-16 md:px-8 dark:bg-n-7/50">
      <div className="w-28 mx-auto mb-8">
        <Image src="/images/faq-image.svg" width={112} height={112} alt="" />
      </div>
      <div className="mb-1 h5">{ctaTitle}</div>
      <div className="mb-8 base1 text-n-4">{ctaSubtitle}</div>
      <button className="btn-blue">{ctaButtonLabel}</button>
    </div>
  </>
);

export default Faq;
