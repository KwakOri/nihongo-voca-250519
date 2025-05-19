import QueryProvider from "@/tanstack/QueryProvider";
import { PropsWithChildren } from "react";

const ProviderLayout = ({ children }: PropsWithChildren) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default ProviderLayout;
