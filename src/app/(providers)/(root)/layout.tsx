import { PropsWithChildren } from "react";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-full bg-black">
      <div className="fixed inset-0 p-4 bg-black">{children}</div>
    </div>
  );
};

export default RootLayout;
