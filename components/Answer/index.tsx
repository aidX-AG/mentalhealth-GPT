import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Loading from "./Loading";
import Actions from "./Actions";

type AnswerProps = {
    children?: React.ReactNode;
    loading?: boolean;
    time?: string;
};

const Answer = ({ children, loading, time }: AnswerProps) => {
    return (
        <div className="max-w-[50rem]">
            <div className="pt-6 px-6 pb-16 space-y-4 bg-n-2 rounded-[1.25rem] md:p-5 md:pb-14 dark:bg-n-7">
                {loading ? <Loading /> : children}
            </div>
            <div className="-mt-8 flex items-end pl-6">
                <div
                    className={`relative shrink-0 w-16 h-16 mr-auto rounded-2xl overflow-hidden ${
                        !loading &&
                        "shadow-[0_0_0_0.25rem_#FEFEFE] dark:shadow-[0_0_0_0.25rem_#232627]"
                    }`}
                >
                    <Image
                        className="object-cover rounded-2xl"
                        src="/images/logo-chat.png"
                        fill
                        alt="Avatar"
                    />
                </div>
                {loading ? (
                    <button className="group flex items-center ml-3 px-2 py-0.5 bg-n-3 rounded-md caption1 txt-n-6 transition-colors hover:text-primary-1 dark:bg-n-7 dark:text-n-3 dark:hover:text-primary-1">
                        <Icon
                            className="w-4 h-4 mr-2 transition-colors group-hover:fill-primary-1 dark:fill-n-3"
                            name="pause-circle"
                        />
                        Pause generating
                    </button>
                ) : (
                    <div className="flex items-center">
                        <div className="caption1 text-n-4/50 dark:text-n-4">
                            {time}
                        </div>
                        <Actions />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Answer;
