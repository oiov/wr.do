type Wired2React<T> =
  | (Partial<T> & React.RefAttributes<T>)
  | React.HTMLAttributes<T>;
declare namespace JSX {
  interface IntrinsicElements {
    "wired-button": Wired2React<import("wired-elements").WiredButton>;
    "wired-calendar": Wired2React<import("wired-elements").WiredCalendar>;
    "wired-card": Wired2React<import("wired-elements").WiredCard>;
    "wired-checkbox": Wired2React<import("wired-elements").WiredCheckbox>;
    "wired-combo": Wired2React<import("wired-elements").WiredCombo>;
    "wired-dialog": Wired2React<import("wired-elements").WiredDialog>;
    "wired-divider": Wired2React<import("wired-elements").WiredDivider>;
    "wired-fab": Wired2React<import("wired-elements").WiredFab>;
    "wired-icon-button": Wired2React<import("wired-elements").WiredIconButton>;
    "wired-image": Wired2React<import("wired-elements").WiredImage>;
    "wired-input": Wired2React<import("wired-elements").WiredInput>;
    "wired-item": Wired2React<import("wired-elements").WiredItem>;
    "wired-link": Wired2React<import("wired-elements").WiredLink>;
    "wired-listbox": Wired2React<import("wired-elements").WiredListbox>;
    "wired-progress": Wired2React<import("wired-elements").WiredProgress>;
    "wired-radio": Wired2React<import("wired-elements").WiredRadio>;
    "wired-search-input": Wired2React<
      import("wired-elements").WiredSearchInput
    >;
    "wired-slider": Wired2React<import("wired-elements").WiredSlider>;
    "wired-spinner": Wired2React<import("wired-elements").WiredSpinner>;
    "wired-tabs": Wired2React<import("wired-elements").WiredTabs>;
    "wired-textarea": Wired2React<import("wired-elements").WiredTextarea>;
    "wired-toggle": Wired2React<import("wired-elements").WiredToggle>;
    "wired-video": Wired2React<import("wired-elements").WiredVideo>;
  }
}
