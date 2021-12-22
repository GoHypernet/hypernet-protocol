export interface ISidebarItem {
  text: string;
  path: string;
  subItems?: ISidebarItem[];
}
