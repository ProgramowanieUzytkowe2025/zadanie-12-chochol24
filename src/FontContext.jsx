import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const FontContext = createContext();

export function FontProvider({ children }) {
    const [czcionka, setCzcionka] = useState('small');

    return (
        <FontContext.Provider value={{ czcionka, setCzcionka }}>
            {children}
        </FontContext.Provider>
    );
}