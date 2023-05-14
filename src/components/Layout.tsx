import { FC, ReactNode, useCallback, useEffect, useRef } from "react";
import { Navbar } from "./Navbar";

export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

export const Layout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <main className="prose mx-auto py-8">
      <Navbar />
      {children}
    </main>
  );
};
