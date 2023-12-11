// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DraftInterface, TemplateInterface } from 'components/types';
import { useToken } from 'hooks/useToken';
import { useVid } from 'hooks/useVid';
import { createContext, Dispatch, PropsWithChildren, useCallback, useContext, useMemo, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { isDidUrl } from '@zcloak/did';

import { signCTpye } from '../../utils';
import { createTemplate, saveTemplate, uploadImage } from '../../utils/api';
import templateReducer, {
  initialTemplate,
  initialTemplateValid,
  TActionTypes,
  TemplateAction,
  TemplateCreateState
} from '../reducer/templateReducer';
import { DidCtx } from './Did';

type TemplateContextType<Action extends TActionTypes> = {
  template: TemplateCreateState;
  dispatch: Dispatch<TemplateAction<Action>>;
} & {
  previewIcon?: string;
  previewBg?: string;
  publish: () => Promise<TemplateInterface>;
  savedraft: () => Promise<DraftInterface>;
};

export const TemplateCtx = createContext<TemplateContextType<TActionTypes>>({} as TemplateContextType<TActionTypes>);

// function verifyCreateTemplate(template?: TemplateCreateState) {
//   if (!template?.background) {
//     throw new Error('Please upload template background.');
//   }
// }

const TemplateProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const initialDraft = location.state?.draftData;
  const { did } = useContext(DidCtx);
  const { vid } = useVid(isDidUrl(did?.id) ? did?.id : null);
  const [template, dispatch] = useReducer(
    templateReducer,
    initialDraft?.draft || (vid ? initialTemplateValid : initialTemplate)
  );
  const { token } = useToken();

  const previewIcon = useMemo(
    () => (template?.icon ? URL.createObjectURL(template.icon) : undefined),
    [template?.icon]
  );

  const previewBg = useMemo(() => (template?.bg ? URL.createObjectURL(template?.bg) : undefined), [template?.bg]);

  const savedraft = useCallback(async () => {
    const { bg, icon } = template;

    if (did) {
      const iconRes = icon ? await uploadImage(icon) : null;
      const picRes = bg ? await uploadImage(bg) : null;
      const res = await saveTemplate(token?.token || undefined, {
        id: initialDraft?.id || uuidv4().replace(/-/g, ''),
        draft: {
          applications: template.applications,
          color: template.color,
          category: template.category,
          duration: template.duration,
          public: template.public,
          title: template.title,
          desc: template.desc,
          background: picRes?.data,
          logo: iconRes?.data,
          onChainAsset: template.onChainAsset,
          fields: template.fields
        }
      });

      return res?.data;
    }
  }, [initialDraft?.id, token, did, template]);

  const publish = useCallback(async () => {
    const { bg, desc, duration, fields, icon, title } = template;

    if (desc && did) {
      const ctype = await signCTpye(
        {
          title,
          description: desc,
          properties: fields || {},
          type: 'object'
        },
        did
      );

      const iconRes = icon ? await uploadImage(icon) : null;
      const picRes = bg ? await uploadImage(bg) : null;
      const res = await createTemplate({
        applications: template.applications,
        color: template.color,
        category: template.category,
        duration,
        title: template.title,
        desc: template.desc,
        background: picRes?.data,
        logo: iconRes?.data,
        onChainAsset: template.onChainAsset,
        public: template.public,
        ctype
      });

      return res?.data;
    }
  }, [did, template]);

  return (
    <TemplateCtx.Provider value={{ savedraft, publish, template, dispatch, previewIcon, previewBg }}>
      {children}
    </TemplateCtx.Provider>
  );
};

export default TemplateProvider;
