import type { ComponentType } from "react";
import type { ReactQuillProps } from "react-quill";

let reactQuillPatched = false;

/**
 * React 19 no longer exposes `findDOMNode`, but react-quill@2 depends on it.
 * This helper patches the prototype to read from the stored ref directly,
 * keeping compatibility until an official release adds support.
 */
export function patchReactQuill(mod: unknown): ComponentType<ReactQuillProps> {
  const { default: ReactQuill } = mod as {
    default?: ComponentType<ReactQuillProps>;
  };

  if (typeof window === "undefined" || !ReactQuill) {
    return ReactQuill as unknown as ComponentType<ReactQuillProps>;
  }

  if (!reactQuillPatched) {
    const proto = ReactQuill.prototype as {
      getEditingArea: () => Element;
      editingArea?: Element | { current?: Element | null };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };

    if (proto?.getEditingArea) {
      const patchedGetEditingArea = function (
        this: {
          editingArea?: Element | { current?: Element | null };
        },
      ): Element {
        if (!this.editingArea) {
          throw new Error("Instantiating on missing editing area");
        }

        const area = this.editingArea as
          | Element
          | { current?: Element | null | undefined }
          | null
          | undefined;
        let element: Element | null | undefined;

        if (area && typeof (area as { current?: Element | null }).current !== "undefined") {
          element = (area as { current?: Element | null }).current ?? undefined;
        } else {
          element = area as Element | null | undefined;
        }

        if (!element) {
          throw new Error("Cannot find element for editing area");
        }

        if (element.nodeType === 3) {
          throw new Error("Editing area cannot be a text node");
        }

        return element;
      };

      proto.getEditingArea = patchedGetEditingArea as typeof proto.getEditingArea;
    }

    reactQuillPatched = true;
  }

  return ReactQuill as unknown as ComponentType<ReactQuillProps>;
}
