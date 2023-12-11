import Dialog from "./Dialog";
import LogoZkid from "@/assets/svg/icon_zkid.svg?react";
import LogoWallet from "@/assets/svg/logo_wallet.svg?react";

const Item = ({
  background,
  icon,
  introduction,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  background: string;
  loading: boolean;
  onClick: () => void;
  introduction: {
    title: string;
    description: string;
  };
}) => {
  return (
    <div
      className="flex items-center rounded-lg px-4 py-3 gap-4 cursor-pointer hover:opacity-80"
      style={{
        background,
      }}
      onClick={onClick}
    >
      {icon}
      <div className="text-left flex-1 min-h-[50px] flex flex-col justify-center">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <div className="text-lg font-semibold text-[#0A1629] mb-2">
              {introduction.title}
            </div>
            <div className="text-sm">{introduction.description}</div>
          </>
        )}
      </div>
    </div>
  );
};

const Connect = ({
  joyIdLoading,
  onJoyIdConnect,
  onWcConnect,
  onZkidWalletConnect,
  openConnect,
  setOpenConnect,
  wcLoading,
  zkidLoading,
}: {
  onWcConnect: () => Promise<void>;
  onZkidWalletConnect: () => void;
  onJoyIdConnect: () => void;
  joyIdLoading: boolean;
  zkidLoading: boolean;
  wcLoading: boolean;
  openConnect: boolean;
  setOpenConnect: (open: boolean) => void;
}) => {
  return (
    <>
      {openConnect && (
        <Dialog
          open={openConnect}
          onClose={() => setOpenConnect(false)}
          title={"Connect a Wallet"}
        >
          <div className="flex flex-col gap-4 text-text1">
            <div className="text-[#333] text-center text-sm pt-4">
              Connect with your wallet to enter your address.
            </div>
            <Item
              background="linear-gradient(90deg, #D7DDFF 0%, rgba(215,221,255,0.2) 100%)"
              icon={<LogoZkid fontSize="large" />}
              introduction={{
                title: "zkID Wallet",
                description: "Connect to your zkID Wallet",
              }}
              loading={zkidLoading}
              onClick={onZkidWalletConnect}
            />
            <Item
              background="linear-gradient(90deg, #BEDDFF 0%, rgba(190,221,255,0.2) 100%)"
              icon={<LogoWallet fontSize="large" />}
              introduction={{
                title: "Crypto Wallet",
                description: "Create a zkID Account with your Crypto Wallets",
              }}
              loading={wcLoading}
              onClick={onWcConnect}
            />
            <Item
              background="linear-gradient(90deg, #DCF4D0 0%, rgba(190,221,255,0.2) 100%)"
              icon={
                <svg
                  fill="none"
                  height="33"
                  viewBox="0 0 33 33"
                  width="33"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    fill="#333333"
                    height="32"
                    rx="16"
                    width="32"
                    y="1"
                  ></rect>
                  <path
                    d="M16.0566 13.646L14.9812 18.7587C14.8814 19.2361 14.4539 19.582 13.9668 19.582C13.6513 19.582 13.3578 19.4407 13.1593 19.1959C13.0046 19.0047 12.9267 18.7697 12.9304 18.5285L10.9879 19.0303C11.0707 19.5394 11.2801 20.0253 11.6138 20.4406C12.1899 21.1555 13.0473 21.5659 13.9655 21.5659C15.3856 21.5659 16.6278 20.5575 16.9201 19.1679L18.0819 13.6472H16.0566V13.646Z"
                    fill="#C1C1C1"
                  ></path>
                  <path
                    clipRule="evenodd"
                    d="M25.1585 10.013C24.507 9.21036 23.54 8.75 22.506 8.75H20.1129L19.6952 10.7327H22.506C22.9396 10.7327 23.3451 10.9252 23.6179 11.2625C23.8908 11.5987 23.9967 12.0359 23.9078 12.4597L23.4901 14.4436H25.5166L25.8491 12.8689C26.061 11.8568 25.8101 10.8155 25.1585 10.013ZM12.1496 15.4166C12.1496 14.8795 12.5856 14.4435 13.1227 14.4435C13.6598 14.4435 14.0945 14.8795 14.0958 15.4166C14.0958 15.9537 13.6598 16.3897 13.1227 16.3897C12.5856 16.3897 12.1496 15.9537 12.1496 15.4166ZM21.4194 15.5166C21.4194 16.1092 20.939 16.5896 20.3464 16.5896C19.7538 16.5896 19.2735 16.1092 19.2735 15.5166C19.2735 14.9241 19.7538 14.4437 20.3464 14.4437C20.939 14.4437 21.4194 14.9241 21.4194 15.5166ZM19.1869 23.2673C20.6057 23.2673 21.8467 22.2601 22.139 20.8717L22.4032 19.6111H24.4298L24.079 21.2797C23.5955 23.5803 21.5373 25.25 19.1869 25.25H16.6391L17.0568 23.2673H19.1869ZM7.53192 12.7203L7.169 14.4449H9.19553L9.47199 13.1295C9.76428 11.7411 11.0053 10.7339 12.4241 10.7339H14.4653L14.883 8.75122H12.4241C10.0736 8.75 8.01542 10.4197 7.53192 12.7203ZM7.70282 21.5391C7.61392 21.9629 7.71987 22.4001 7.99267 22.7363C8.26547 23.0736 8.67102 23.266 9.10458 23.2673H11.8265L11.4088 25.25H9.10458C8.07061 25.25 7.10363 24.7896 6.45207 23.987C5.80051 23.1844 5.54841 22.1431 5.76154 21.1311L5.9296 20.3346L8.07305 19.7817L7.70282 21.5391Z"
                    fill="#8CDD00"
                    fillRule="evenodd"
                  ></path>
                </svg>
              }
              introduction={{
                title: "JoyID Wallet",
                description: "Create a zkID Account with your JoyID Wallet",
              }}
              loading={joyIdLoading}
              onClick={onJoyIdConnect}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};

export default Connect;
