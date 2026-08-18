import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  type BadgeProps,
  type ButtonProps,
} from "@brevy/ui"
import { Check, Plus } from "lucide-react"
import type { ReactNode } from "react"

import { EmailField } from "./components/email-field"

export type Axis = {
  label: string
  values: readonly string[]
}

export type Omission = {
  key: string
  note: "missing in Figma" | "identical to Default"
}

export type ComponentEntry = {
  slug: string
  name: string
  axes: readonly Axis[]
  omitted: readonly Omission[]
  render: (combination: Record<string, string>) => ReactNode
}

type Force = "hover" | "focus-visible" | "active" | undefined

const forceOf = (state: string | undefined): Force => {
  if (state === "Hover") return "hover"
  if (state === "Focus") return "focus-visible"
  if (state === "Active") return "active"
  return undefined
}

/** Variant and form are not perpendicular on the board: primary is never drawn
 *  icon-only, ghost is never drawn with an icon beside a label. */
type ButtonForm = {
  variant: NonNullable<ButtonProps["variant"]>
  children: ReactNode
  label?: string
}

const buttonForms: Record<string, ButtonForm> = {
  "Primary · label": { variant: "primary", children: "Button" },
  "Primary · icon + label": {
    variant: "primary",
    children: (
      <>
        <Plus />
        New chat
      </>
    ),
  },
  "Ghost · label": { variant: "ghost", children: "Button" },
  "Ghost · icon only": {
    variant: "ghost",
    children: <Plus />,
    label: "New chat",
  },
}

const badgeVariants: Record<string, NonNullable<BadgeProps["variant"]>> = {
  Default: "default",
  Secondary: "secondary",
  Outline: "outline",
  Destructive: "destructive",
  Verified: "verified",
}

export const components: readonly ComponentEntry[] = [
  {
    slug: "button",
    name: "Button",
    // Drawn from Brevy Website · frame 22912:1932
    axes: [
      { label: "Form", values: Object.keys(buttonForms) },
      {
        label: "State",
        values: ["Default", "Hover", "Focus", "Active", "Disabled"],
      },
    ],
    omitted: [{ key: "Primary · label/Active", note: "missing in Figma" }],
    render: (combination) => {
      const state = combination.State
      const form = buttonForms[combination.Form ?? ""]

      if (!form) {
        return null
      }

      return (
        <Button
          variant={form.variant}
          aria-label={form.label}
          disabled={state === "Disabled"}
          data-force={forceOf(state)}
        >
          {form.children}
        </Button>
      )
    },
  },
  {
    slug: "input",
    name: "Input",
    // Drawn from Brevy app · component set 65:533
    axes: [
      { label: "Type", values: ["Text", "File"] },
      {
        label: "State",
        values: [
          "Default",
          "Focus",
          "Filled",
          "Disabled",
          "Error",
          "Error (Focus)",
        ],
      },
    ],
    omitted: [],
    render: (combination) => {
      const state = combination.State
      const invalid = state === "Error" || state === "Error (Focus)"
      const focused = state === "Focus" || state === "Error (Focus)"

      return (
        <Input
          type={combination.Type === "File" ? "file" : "text"}
          aria-label="Email"
          placeholder="hello@brevy.com"
          defaultValue={
            state === "Filled" && combination.Type !== "File"
              ? "hello@brevy.com"
              : undefined
          }
          disabled={state === "Disabled"}
          aria-invalid={invalid}
          data-force={focused ? "focus-visible" : undefined}
        />
      )
    },
  },
  {
    slug: "badge",
    name: "Badge",
    // Drawn from Brevy app · component set 26:169
    axes: [
      {
        label: "Variant",
        values: ["Default", "Secondary", "Outline", "Destructive", "Verified"],
      },
      { label: "State", values: ["Default", "Hover", "Focus"] },
    ],
    omitted: [
      { key: "Secondary/Hover", note: "missing in Figma" },
      { key: "Outline/Hover", note: "missing in Figma" },
      { key: "Destructive/Hover", note: "identical to Default" },
      { key: "Verified/Hover", note: "identical to Default" },
    ],
    render: (combination) => (
      <Badge
        asChild
        variant={badgeVariants[combination.Variant ?? ""] ?? "default"}
      >
        <a href="#" data-force={forceOf(combination.State)}>
          {combination.Variant === "Verified" && <Check />}
          Badge
        </a>
      </Badge>
    ),
  },
  {
    slug: "card",
    name: "Card",
    axes: [],
    omitted: [],
    render: () => (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Visit summary</CardTitle>
          <CardDescription>Two shifts logged this week.</CardDescription>
          <CardAction>
            <Badge variant="verified">
              <Check />
              Verified
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Hours are approved and ready for payroll.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost">Open</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    slug: "form",
    name: "Form",
    axes: [],
    omitted: [],
    render: () => <EmailField />,
  },
  {
    slug: "label",
    name: "Label",
    axes: [],
    omitted: [],
    render: () => (
      <div className="grid w-full gap-2">
        <Label htmlFor="catalog-label-demo">Email</Label>
        <Input id="catalog-label-demo" placeholder="hello@brevy.com" />
      </div>
    ),
  },
]

const termsOf = (query: string) =>
  query.trim().toLowerCase().split(/\s+/).filter(Boolean)

const hits = (haystack: string, term: string) =>
  haystack.toLowerCase().includes(term)

const axisValues = (entry: ComponentEntry) =>
  entry.axes.flatMap((axis) => axis.values)

/** A term satisfied by the component name selects the component whole; the rest
 *  narrow its grid. Axis labels are deliberately not searchable. */
export function componentMatches(entry: ComponentEntry, query: string) {
  return termsOf(query).every(
    (term) =>
      hits(entry.name, term) ||
      axisValues(entry).some((value) => hits(value, term)),
  )
}

function narrowingTerms(entry: ComponentEntry, query: string) {
  return termsOf(query).filter((term) => !hits(entry.name, term))
}

export function combinationMatches(
  entry: ComponentEntry,
  combination: Record<string, string>,
  query: string,
) {
  const pending = narrowingTerms(entry, query)
  if (pending.length === 0) {
    return true
  }

  const values = entry.axes.map((axis) => combination[axis.label] ?? "")

  return pending.every((term) => values.some((value) => hits(value, term)))
}

export function isOmitted(
  entry: ComponentEntry,
  combination: Record<string, string>,
) {
  return entry.omitted.some((o) => o.key === combinationKey(entry, combination))
}

export function matchingCombinations(entry: ComponentEntry, query: string) {
  return combinations(entry.axes)
    .filter((row) => !isOmitted(entry, row))
    .filter((row) => combinationMatches(entry, row, query))
}

/** Ranks the other components for a query the current one cannot satisfy:
 *  a name hit outranks a value hit, a tighter name hit outranks a looser one,
 *  and among value-only hits the component with more matching variants wins. */
function nameRank(entry: ComponentEntry, query: string) {
  const name = entry.name.toLowerCase()
  const terms = termsOf(query)

  if (terms.some((term) => term === name)) return 0
  if (terms.some((term) => name.startsWith(term))) return 1
  if (terms.some((term) => name.includes(term))) return 2

  return 3
}

export function bestMatch(query: string, excludeSlug: string) {
  if (termsOf(query).length === 0) {
    return undefined
  }

  return components
    .filter(
      (entry) => entry.slug !== excludeSlug && componentMatches(entry, query),
    )
    .sort((a, b) => {
      const byName = nameRank(a, query) - nameRank(b, query)
      if (byName !== 0) return byName

      const byCount =
        matchingCombinations(b, query).length -
        matchingCombinations(a, query).length
      if (byCount !== 0) return byCount

      return components.indexOf(a) - components.indexOf(b)
    })[0]
}

export function filterComponents(query: string) {
  return components.filter((entry) => componentMatches(entry, query))
}

export function getComponent(slug: string) {
  return components.find((entry) => entry.slug === slug)
}

export function combinations(axes: readonly Axis[]) {
  return axes.reduce<Record<string, string>[]>(
    (acc, axis) =>
      acc.flatMap((row) =>
        axis.values.map((value) => ({ ...row, [axis.label]: value })),
      ),
    [{}],
  )
}

export function combinationKey(
  entry: ComponentEntry,
  combination: Record<string, string>,
) {
  return entry.axes.map((axis) => combination[axis.label] ?? "").join("/")
}

export function variantCount(entry: ComponentEntry) {
  return combinations(entry.axes).length - entry.omitted.length
}
