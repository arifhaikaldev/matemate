A PRD is exactly what you need here because you're no longer building a math app—you are building an **educational rendering engine**. Once this design system exists, every future lesson is just JSON.

# PRD: Educational Design System (EDS)

## Vision

Create a reusable educational design system that renders AI-generated lesson JSON into beautiful, interactive, Brilliant.org-style learning experiences.

The design system must be curriculum-agnostic. It should support Mathematics today and be extensible to Physics, Chemistry, Biology, Economics, and other STEM subjects without changing the lesson format.

---

# Goals

### Primary Goal

Transform structured lesson JSON into interactive educational experiences.

```
Lesson JSON

↓

Educational Design System

↓

Interactive Lesson
```

---

### Secondary Goals

* Consistent visual language
* Reusable components
* Highly interactive
* Mobile-first
* Fast rendering
* Accessible
* AI-compatible
* Themeable
* Extensible

---

# Non Goals

The design system does NOT

* Generate lessons
* Grade students
* Store progress
* Generate AI content
* Generate images

Those belong elsewhere.

---

# Architecture

```
Lesson JSON

↓

Lesson Renderer

↓

Screen Renderer

↓

Visual Renderer

↓

Interaction Layer

↓

Educational Components
```

---

# Core Principles

## 1. Data Driven

Never hardcode lessons.

Everything comes from JSON.

```
JSON

↓

React
```

Never

```
React

↓

Hardcoded lesson
```

---

## 2. Components Are Educational Objects

Don't build pages.

Build learning primitives.

Examples

```
Number Line

Fraction Bar

Balance Scale

Clock

Money

Coordinate Plane

Graph

Grid

Cards

Pattern Grid

Dice

Thermometer
```

---

## 3. One Concept = One Visual

Every screen has

```
Question

+

Exactly one primary visual
```

Avoid clutter.

---

## 4. Animation Supports Learning

Animation is only used to explain concepts.

Examples

Good

* point slides
* fraction grows
* graph draws itself
* balance tilts

Bad

* fireworks
* confetti everywhere
* spinning objects

---

# Design Tokens

## Colors

Primary

Secondary

Success

Warning

Danger

Neutral

Surface

Background

Text

---

## Typography

Heading XL

Heading L

Heading M

Body

Caption

Equation

Number

---

## Spacing

4

8

12

16

24

32

48

64

---

## Radius

Small

Medium

Large

Round

---

## Shadows

Card

Floating

Dialog

None

---

# Educational Component Library

## Numbers

### NumberLine

Props

```
minimum

maximum

tickInterval

highlight

labels

showArrow

showZero
```

---

### Integer Chips

```
positive

negative

count

grouping
```

---

### Number Cards

```
values

selected

draggable
```

---

## Fractions

Fraction Bar

Fraction Circle

Pie Fraction

Mixed Number

Equivalent Fraction

---

## Algebra

Balance Scale

Equation Builder

Algebra Tiles

Expression Tree

Variable Box

---

## Geometry

Coordinate Plane

Grid

Triangle

Circle

Polygon

Angle

Compass

Ruler

Transformations

---

## Statistics

Bar Chart

Line Chart

Histogram

Scatter Plot

Table

Frequency Table

Stem Leaf

Box Plot

---

## Probability

Dice

Coin

Spinner

Cards

Probability Tree

---

## Real World

Clock

Calendar

Money

Building

Elevator

Thermometer

Mountain

River

Temperature

Road

Map

---

# Screen Types

Observation

Explanation

Multiple Choice

Number Input

Drag

Drop

Slider

Ordering

Matching

Fill Blank

Draw

Simulation

Reflection

Mastery

Celebration

---

# Animation Library

Fade

Slide

Grow

Draw

Highlight

Count Up

Bounce

Shake

Rotate

Pulse

Reveal

Appear

None

---

# Interaction Library

Tap

Drag

Drop

Slider

Draw

Connect

Type

Select

Reveal

Hover

Long Press

---

# Layout System

Top Visual

Bottom Visual

Split

Left Visual

Right Visual

Full Visual

Minimal

---

# Accessibility

Every component must support

```
altText

spokenDescription

keyboard

screenReader

highContrast

reducedMotion
```

---

# Component API Example

```
NumberLine

Props

minimum

maximum

highlight

tickInterval

labels

interactive

animation

theme
```

---

# Renderer

```
Lesson

↓

Screen

↓

Visual

↓

Question

↓

Interaction
```

---

# Component Registry

```
number_line

↓

NumberLine.tsx

fraction_bar

↓

FractionBar.tsx

balance_scale

↓

BalanceScale.tsx

clock

↓

Clock.tsx
```

No switch statements.

Registry lookup only.

---

# Theming

Support

Light

Dark

Classroom

Minimal

Future custom themes

without changing lessons.

---

# Performance Requirements

* Lazy load lessons
* Lazy load visuals
* Tree-shake unused components
* Render under 100 ms for a screen change
* Smooth 60 FPS animations on mid-range mobile devices
* SSR compatible with Next.js
* Hydrate only interactive elements where possible

---

# Folder Structure

```
packages/

educational-design-system/

src/

components/

NumberLine/

FractionBar/

BalanceScale/

Clock/

Graph/

...

renderers/

LessonRenderer/

ScreenRenderer/

VisualRenderer/

QuestionRenderer/

InteractionRenderer/

registry/

visualRegistry.ts

animations/

hooks/

themes/

tokens/

types/

utils/

tests/
```

---

# Success Metrics

### Engineering

* A new lesson requires **zero** React code.
* A new visual component can be added without modifying existing lessons.
* All visuals are reusable across subjects.

### Educational

* Every screen contains a meaningful visual that reinforces the concept.
* Visuals are interactive rather than decorative.
* Animations clarify concepts instead of distracting from them.

### AI Integration

* The AI only emits valid JSON using approved component types and properties.
* Every generated lesson renders successfully through the design system without manual intervention.

---

## Roadmap

### Phase 1 – MVP (4–6 weeks)

Build the core engine and ~15 high-value components:

* Number Line
* Fraction Bar
* Balance Scale
* Coordinate Plane
* Function Graph
* Money
* Clock
* Thermometer
* Table
* Bar Chart
* Dice
* Spinner
* Number Cards
* Grid
* Question/Interaction renderer

This is enough to cover a large portion of Form 1 mathematics.

### Phase 2 – Complete Mathematics

Expand to ~35–40 educational components covering the full Form 1–5 Malaysian mathematics syllabus.

### Phase 3 – Cross-Subject Platform

Add subject-specific components (e.g., circuit diagrams for Physics, molecular structures for Chemistry, anatomical diagrams for Biology) while keeping the same lesson JSON format and rendering architecture.

This design system becomes the core asset of the platform. The AI generates curriculum content, while the Educational Design System is responsible for rendering that content into a polished, interactive learning experience. Once this separation is established, adding new lessons becomes a content-generation task rather than a front-end development task.
