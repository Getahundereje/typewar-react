import { useEffect } from "react";

function BlockBackNavigation() {
  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
      console.log("relod");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);

    return () => {
      window.removeEventListener("popstate", blockBack);
    };
  }, []);

  return null;
}

export default BlockBackNavigation;
