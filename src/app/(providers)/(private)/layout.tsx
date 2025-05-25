import AuthGuard from "@/components/AuthGuard";
import { PropsWithChildren } from "react";

const PrivateLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthGuard>
      <div className="w-full h-full bg-black">
        <div className="fixed inset-0 p-4 bg-black">{children}</div>
      </div>
    </AuthGuard>
  );
};

export default PrivateLayout;
