import { AuthProvider } from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider/QueryProvider";
import { PropsWithChildren } from "react";

const ProviderLayout = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
};

export default ProviderLayout;
