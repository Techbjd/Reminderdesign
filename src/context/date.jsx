import { createContext } from "react";

export const dateContext = createContext(null);




export const dateProvider=({children})=>{




    return (
        <dateContext.Provider value={{ }}>
          {children}
        </dateContext.Provider>
      );
}