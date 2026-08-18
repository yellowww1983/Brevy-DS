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
import { Check } from "lucide-react"
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
  origin: "figma" | "shadcn"
  figmaNodeId?: string
  axes: readonly Axis[]
  omitted: readonly Omission[]
  render: (combination: Record<string, string>) => ReactNode
}

type Force = "hover" | "focus-visible" | "active" | undefined

const forceOf = (state: string | undefined): Force => {
  if (state === "Hover") return "hover"
  if (state === "Focus") return "focus-visible"
  if (state === "Pressed") return "active"
  return undefined
}

const buttonVariants: Record<string, NonNullable<ButtonProps["variant"]>> = {
  Default: "default",
  Secondary: "secondary",
  Destructive: "destructive",
  Outline: "outline",
  Ghost: "ghost",
  Link: "link",
}

const buttonSizes: Record<string, NonNullable<ButtonProps["size"]>> = {
  default: "default",
  sm: "sm",
  lg: "lg",
  icon: "icon",
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
    origin: "figma",
    figmaNodeId: "37:931",
    axes: [
      {
        label: "Variant",
        values: [
          "Default",
          "Secondary",
          "Destructive",
          "Outline",
          "Ghost",
          "Link",
        ],
      },
      { label: "Size", values: ["default", "sm", "lg", "icon"] },
      {
        label: "State",
        values: ["Default", "Hover", "Focus", "Loading", "Disabled", "Pressed"],
      },
    ],
    omitted: [
      { key: "Default/icon/Loading", note: "missing in Figma" },
      { key: "Secondary/icon/Loading", note: "missing in Figma" },
      { key: "Destructive/icon/Loading", note: "missing in Figma" },
      { key: "Outline/icon/Loading", note: "missing in Figma" },
      { key: "Ghost/icon/Loading", note: "missing in Figma" },
      { key: "Link/icon/Default", note: "missing in Figma" },
      { key: "Link/icon/Hover", note: "missing in Figma" },
      { key: "Link/icon/Focus", note: "missing in Figma" },
      { key: "Link/icon/Loading", note: "missing in Figma" },
      { key: "Link/icon/Disabled", note: "missing in Figma" },
      { key: "Link/icon/Pressed", note: "missing in Figma" },
    ],
    render: (combination) => {
      const size = combination.Size ?? "default"
      const state = combination.State

      return (
        <Button
          variant={buttonVariants[combination.Variant ?? ""] ?? "default"}
          size={buttonSizes[size] ?? "default"}
          disabled={state === "Disabled"}
          loading={state === "Loading"}
          data-force={forceOf(state)}
        >
          {size === "icon" ? <Check aria-label="Confirm" /> : "Button"}
        </Button>
      )
    },
  },
  {
    slug: "input",
    name: "Input",
    origin: "figma",
    figmaNodeId: "65:533",
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
          defaultValue={state === "Filled" ? "hello@brevy.com" : undefined}
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
    origin: "figma",
    figmaNodeId: "26:169",
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
    origin: "shadcn",
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
          <Button size="sm">Open</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    slug: "form",
    name: "Form",
    origin: "shadcn",
    axes: [],
    omitted: [],
    render: () => <EmailField />,
  },
  {
    slug: "label",
    name: "Label",
    origin: "shadcn",
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
