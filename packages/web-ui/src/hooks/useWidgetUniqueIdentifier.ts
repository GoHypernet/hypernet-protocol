import { useStoreContext } from "@web-ui/contexts";

export function useWidgetUniqueIdentifier(): string {
  try {
    const { widgetUniqueIdentifier } = useStoreContext();
    return `${widgetUniqueIdentifier}-`;
  } catch (error) {
    return "";
  }
}
