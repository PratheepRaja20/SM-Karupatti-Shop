import { createContext, useContext, useState } from 'react';
import translations from '../i18n/translations';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en'); // default English

  const toggle = () => setLang((l) => (l === 'en' ? 'ta' : 'en'));
  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
