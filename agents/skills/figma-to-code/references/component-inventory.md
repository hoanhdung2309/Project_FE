# Component Inventory — Quick Lookup

Find the right component fast. All imports from `@vtrip/ui/components/<file>`.

---

## By Category

### Actions

| Component | Import | Variants | Sizes |
|---|---|---|---|
| **Button** | `button` | default, outline, secondary, ghost, destructive, link | default, xs, sm, lg, xl, icon, icon-xs, icon-sm, icon-lg, icon-12 |
| **ButtonGroup** | `button-group` | orientation: horizontal, vertical | — |
| **Toggle** | `toggle` | default, outline | default, sm, lg |
| **ToggleGroup** | `toggle-group` | — | — |

### Data Entry

| Component | Import | Variants | Sub-components |
|---|---|---|---|
| **Input** | `input` | — | — |
| **InputGroup** | `input-group` | addon align: inline-start/end, block-start/end; button size: xs, sm, icon-xs, icon-sm | InputGroup, InputGroupAddon, InputGroupButton |
| **InputLabel** | `input-label` | — | — |
| **InputOTP** | `input-otp` | — | InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator |
| **NumberInput** | `number-input` | — | — |
| **Textarea** | `textarea` | — | — |
| **Checkbox** | `checkbox` | — | — |
| **RadioGroup** | `radio-group` | — | RadioGroup, RadioGroupItem |
| **Select** | `select` | — | SelectRoot, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton |
| **NativeSelect** | `native-select` | — | NativeSelect, NativeSelectOptGroup, NativeSelectOption |
| **Combobox** | `combobox` | — | Combobox, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxGroupLabel, ComboboxItem, ComboboxSeparator |
| **Switch** | `switch` | — | — |
| **Slider** | `slider` | — | — |
| **Calendar** | `calendar` | — | Calendar, CalendarDayButton, CalendarNavPopover |
| **CalendarMobile** | `calendar.mobile` | — | CalendarMobile, CalendarDayButton |

### Forms

| Component | Import | Variants | Sub-components |
|---|---|---|---|
| **Field** | `field` | orientation: vertical, horizontal, responsive | Field, FieldLabel, FieldContent, FieldDescription, FieldError |
| **Label** | `label` | — | — |

### Layout & Structure

| Component | Import | Sub-components |
|---|---|---|
| **Card** | `card` | Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter |
| **Accordion** | `accordion` | Accordion, AccordionItem, AccordionTrigger, AccordionContent |
| **Collapsible** | `collapsible` | Collapsible, CollapsibleTrigger, CollapsibleContent |
| **AspectRatio** | `aspect-ratio` | — |
| **Separator** | `separator` | — |
| **ResizablePanel** | `resizable` | ResizableHandle, ResizablePanel, ResizablePanelGroup |
| **ScrollArea** | `scroll-area` | ScrollArea, ScrollBar |
| **Table** | `table` | Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption |
| **Container** | `container` | — |
| **DesktopLayout** | `desktop-layout` | — |

### Navigation

| Component | Import | Sub-components |
|---|---|---|
| **Tabs** | `tabs` | Tabs, TabsList (variant: default, line), TabsTrigger, TabsContent |
| **Breadcrumb** | `breadcrumb` | Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis |
| **NavigationMenu** | `navigation-menu` | NavigationMenu, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuViewport, navigationMenuTriggerStyle |
| **Pagination** | `pagination` | Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis |
| **Menubar** | `menubar` | Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent, MenubarShortcut |

### Overlays & Dialogs

| Component | Import | Sub-components |
|---|---|---|
| **Dialog** | `dialog` | Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogFooter, DialogTitle, DialogDescription |
| **AlertDialog** | `alert-dialog` | AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel |
| **Sheet** | `sheet` | Sheet, SheetTrigger, SheetContent, SheetClose, SheetHeader, SheetFooter, SheetTitle, SheetDescription |
| **Drawer** | `drawer` | Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription |
| **Popover** | `popover` | Popover, PopoverTrigger, PopoverContent, PopoverAnchor |
| **HoverCard** | `hover-card` | HoverCard, HoverCardTrigger, HoverCardContent |
| **Tooltip** | `tooltip` | Tooltip, TooltipTrigger, TooltipContent, TooltipProvider |

### Menus

| Component | Import | Sub-components |
|---|---|---|
| **DropdownMenu** | `dropdown-menu` | DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup |
| **ContextMenu** | `context-menu` | ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup |
| **Command** | `command` | Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator |

### Feedback & Display

| Component | Import | Variants | Sub-components |
|---|---|---|---|
| **Alert** | `alert` | default, destructive | Alert, AlertTitle, AlertDescription, AlertAction |
| **Badge** | `badge` | default, secondary, destructive, outline, ghost, link | — |
| **Empty** | `empty` | media variant: default, icon | Empty, EmptyMedia, EmptyTitle, EmptyDescription, EmptyActions |
| **Item** | `item` | variant: default, outline, muted; size: default, sm, xs; media: default, icon, image | Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemAction |
| **Progress** | `progress` | — | Progress, ProgressIndicator |
| **Skeleton** | `skeleton` | — | — |
| **Spinner** | `spinner` | — | — |
| **Avatar** | `avatar` | — | Avatar, AvatarImage, AvatarFallback, AvatarGroup |
| **Sonner** (Toast) | `sonner` | — | Toaster |

### Data Visualization

| Component | Import | Sub-components |
|---|---|---|
| **Chart** | `chart` | ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle |
| **Carousel** | `carousel` | Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext |

### Utility

| Component | Import | Notes |
|---|---|---|
| **Kbd** | `kbd` | Keyboard shortcut display. Kbd, KbdGroup |
| **SectionTitle** | `section-title` | Section heading |
| **Direction** | `direction` | RTL/LTR provider. DirectionProvider, useDirection |

### Sidebar (Admin)

| Component | Import | Notes |
|---|---|---|
| **Sidebar** | `sidebar` | Full sidebar system with 20+ sub-components. SidebarMenuButton variant: default, outline; size: default, sm, lg |

---

## Components with CVA Variants (Quick Reference)

| Component | CVA Export | Variants | Sizes |
|---|---|---|---|
| Button | `buttonVariants` | default, outline, secondary, ghost, destructive, link | default, xs, sm, lg, xl, icon, icon-xs, icon-sm, icon-lg, icon-12 |
| Badge | `badgeVariants` | default, secondary, destructive, outline, ghost, link | — |
| Toggle | `toggleVariants` | default, outline | default, sm, lg |
| Alert | `alertVariants` | default, destructive | — |
| Tabs (list) | `tabsListVariants` | default, line | — |
| Item | `itemVariants` | default, outline, muted | default, sm, xs |
| Field | `fieldVariants` | orientation: vertical, horizontal, responsive | — |
| ButtonGroup | `buttonGroupVariants` | orientation: horizontal, vertical | — |
| Empty (media) | `emptyMediaVariants` | default, icon | — |
| InputGroup (addon) | `inputGroupAddonVariants` | align: inline-start/end, block-start/end | — |
| InputGroup (button) | `inputGroupButtonVariants` | — | xs, sm, icon-xs, icon-sm |
| NavigationMenu | `navigationMenuTriggerStyle` | (single style, no variants) | — |
| Sidebar (menu btn) | `sidebarMenuButtonVariants` | default, outline | default, sm, lg |

---

## Base UI Primitives Used

| Primitive | Components |
|---|---|
| `@base-ui/react/accordion` | Accordion |
| `@base-ui/react/alert-dialog` | AlertDialog |
| `@base-ui/react/avatar` | Avatar |
| `@base-ui/react/button` | Button |
| `@base-ui/react/checkbox` | Checkbox |
| `@base-ui/react/collapsible` | Collapsible |
| `@base-ui/react/context-menu` | ContextMenu |
| `@base-ui/react/dialog` | Dialog, Sheet |
| `@base-ui/react/direction-provider` | Direction |
| `@base-ui/react/input` | Input, InputLabel, NumberInput |
| `@base-ui/react/menu` | DropdownMenu, Menubar |
| `@base-ui/react/menubar` | Menubar |
| `@base-ui/react/navigation-menu` | NavigationMenu |
| `@base-ui/react/popover` | Popover |
| `@base-ui/react/preview-card` | HoverCard |
| `@base-ui/react/progress` | Progress |
| `@base-ui/react/radio` / `radio-group` | RadioGroup |
| `@base-ui/react/scroll-area` | ScrollArea |
| `@base-ui/react/select` | Select |
| `@base-ui/react/separator` | Separator |
| `@base-ui/react/slider` | Slider |
| `@base-ui/react/switch` | Switch |
| `@base-ui/react/tabs` | Tabs |
| `@base-ui/react/toggle` | Toggle, ToggleGroup |
| `@base-ui/react/toggle-group` | ToggleGroup |
| `@base-ui/react/tooltip` | Tooltip |
| `@base-ui/react/merge-props` + `use-render` | Badge, Breadcrumb, ButtonGroup, Item, Sidebar |

---

## Icons

- **Custom icons:** ~1,044 in `@vtrip/ui/icons` (barrel import)
- **Lucide icons:** `lucide-react` for standard icons (Search, ChevronDown, X, Check, etc.)
- **Import:** `import { IconName } from "@vtrip/ui/icons"` or `import { Search } from "lucide-react"`

## Hooks

| Hook | Import | Description |
|---|---|---|
| `useIsMobile` | `@vtrip/ui/hooks/use-mobile` | Returns true when viewport < 768px |

## Utilities

| Utility | Import | Description |
|---|---|---|
| `cn()` | `@vtrip/ui/lib/utils` | Merge Tailwind classes (clsx + tailwind-merge) |
| `getWeekdays()` | `@vtrip/ui/lib/utils` | Get weekday names for calendar |
