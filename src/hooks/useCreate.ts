// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { generateDid, siweLogin, zkLogin } from "@/utils";
import { mainnet, useAccount, useConnect, useSignMessage } from "wagmi";

import { BrowserDidCtx, DidCtx, joyidConnector } from "./ctx";
import { isBindDid, isKycBind } from "./useQueryBind";
import { useToggle } from "./useToggle";
import { useUnlock } from "./useUnlock";

enum Step {
  Init = 0,
  Connect = 1,
}

export type EthWalletType = "WalletConnect" | "JoyId";

export function useCreate() {
  const [openConnect, setOpenConnect] = useState(false);
  const [openBind, setOpenBind] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);

  const [zkidLoading, toggleZkidLoading] = useToggle();
  const [wcLoading, toggleWcLoading] = useToggle();
  const [joyIdLoading, toggleJoyLoading] = useToggle();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { didAccounts, isBind, isLocked, keyring } = useContext(BrowserDidCtx);
  const { signMessageAsync } = useSignMessage();
  const { setDid, setProvider } = useContext(DidCtx);
  const { connectAsync } = useConnect();
  const [step, setStep] = useState(Step.Init);
  const [unlock] = useUnlock();

  const onZkidWalletConnect = useCallback(async () => {
    toggleZkidLoading();

    const { did, provider } = await zkLogin(true);

    await siweLogin("zkid-wallet", did);

    setDid(did);
    setProvider(provider);
    toggleZkidLoading();
  }, [toggleZkidLoading, setDid, setProvider]);

  const reset = useCallback(() => {
    setStep(Step.Init);
    setOpenConnect(false);
    setOpenBind(false);
    setOpenRestore(false);
  }, []);

  const onWcConnect = useCallback(async () => {
    try {
      toggleWcLoading();

      if (!isConnected) {
        setOpenConnect(false);

        await open({ view: "Connect" });

        setStep(Step.Connect);
      } else {
        if (didAccounts?.current) {
          const _isBind = await isBindDid(
            address,
            didAccounts.current.instance.id
          );

          if (_isBind) {
            await unlock(didAccounts);
            await siweLogin("zkid-browser", didAccounts.current.instance);

            setDid(didAccounts.current?.instance);

            reset();
          } else {
            return setOpenBind(true);
          }
        } else {
          const _isBind = await isBindDid(address);
          const _isKycBind = await isKycBind(address);

          if (_isBind || _isKycBind) return setOpenRestore(true);

          await generateDid(didAccounts, address, signMessageAsync);

          return setOpenBind(true);
        }
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggleWcLoading();
    }
  }, [
    toggleWcLoading,
    reset,
    address,
    isConnected,
    open,
    signMessageAsync,
    setDid,
    didAccounts,
    unlock,
  ]);

  const onJoyIdConnect = useCallback(async () => {
    try {
      toggleJoyLoading();

      if (!isConnected) {
        setOpenConnect(false);

        await connectAsync({ connector: joyidConnector, chainId: mainnet.id });

        setStep(Step.Connect);
      } else {
        if (didAccounts?.current) {
          const _isBind = await isBindDid(
            address,
            didAccounts.current.instance.id
          );

          if (_isBind) {
            await unlock(didAccounts);
            await siweLogin("zkid-browser", didAccounts.current.instance);

            setDid(didAccounts.current?.instance);

            reset();
          } else {
            return setOpenBind(true);
          }
        } else {
          const _isBind = await isBindDid(address);
          const _isKycBind = await isKycBind(address);

          if (_isBind || _isKycBind) return setOpenRestore(true);

          await generateDid(didAccounts, address, signMessageAsync);

          return setOpenBind(true);
        }
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toggleJoyLoading();
    }
  }, [
    toggleJoyLoading,
    reset,
    address,
    connectAsync,
    isConnected,
    signMessageAsync,
    setDid,
    didAccounts,
    unlock,
  ]);

  useEffect(() => {
    if (step === Step.Connect && address && didAccounts) {
      if (didAccounts.current) {
        const did = didAccounts.current.instance;

        isBindDid(address, did.id).then((isBind) => {
          if (isBind) {
            unlock(didAccounts).then(() => {
              siweLogin("zkid-browser", did).then(() => {
                setDid(didAccounts.current?.instance);
                reset();
              });
            });
          }
        });
      } else {
        isBindDid(address).then((isBind) => {
          if (isBind) {
            setOpenRestore(true);
          } else {
            generateDid(didAccounts, address, signMessageAsync).then(() =>
              setOpenBind(true)
            );
          }
        });
      }
    }
  }, [step, signMessageAsync, unlock, setDid, address, didAccounts, reset]);

  return {
    onWcConnect,
    onZkidWalletConnect,
    zkidLoading,
    wcLoading,
    openConnect,
    setOpenConnect,
    openBind,
    setOpenBind,
    didAccounts,
    isBind,
    isLocked,
    keyring,
    setDid,
    openRestore,
    setOpenRestore,
    reset,
    onJoyIdConnect,
    joyIdLoading,
  };
}
