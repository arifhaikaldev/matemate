I would go one step further.

Don't build just a validator. Build a **Curriculum Compiler**.

Think of it like TypeScript.

```
Textbook JSON
      │
      ▼
Lesson Generator (AI)
      │
      ▼
Lesson JSON
      │
      ▼
Curriculum Compiler
      │
      ├── Schema Validation
      ├── Pedagogy Validation
      ├── Dependency Validation
      ├── Difficulty Validation
      ├── Asset Validation
      ├── Coverage Validation
      ├── App Compatibility
      │
      ▼
Production Lesson
```

---

# Stage 1 — Schema Validator

Checks structural correctness.

Example checks:

```
✓ lessonId exists

✓ title exists

✓ concept exists

✓ screens exists

✓ screens.length >= 5

✓ screens.length <= 15

✓ screen ids unique

✓ valid screen type

✓ valid choices

✓ answer exists

✓ no duplicate ids
```

Failure example

```
ERROR

Lesson: 1.1.2

Screen 4

Missing correctAnswer
```

---

# Stage 2 — Pedagogy Validator

This is the important one.

A Brilliant lesson has a rhythm.

Every lesson should contain

```
Hook

↓

Discovery

↓

Guided Practice

↓

Reflection

↓

Application

↓

Mastery
```

Validator

```
if no Observation

ERROR

Missing lesson hook


if no Reflection

WARNING

Student never summarizes concept


if no Mastery

ERROR

Lesson incomplete
```

---

# Stage 3 — Screen Flow Validator

Checks navigation.

```
Screen1

↓

Screen2

↓

Screen3

↓

Screen4
```

Detects

```
Dead screen

Loop

Broken next pointer

Missing screen

Duplicate screen

Infinite loop
```

---

# Stage 4 — Misconception Validator

Every lesson should attack misconceptions.

Example

```
Positive & Negative Numbers
```

Should include

```
Negative means bad

Positive always larger

Left always negative
```

Validator

```
if misconceptions.length < 2

WARNING

Lesson probably too shallow
```

---

# Stage 5 — Difficulty Curve

Brilliant gradually increases challenge.

```
Easy

↓

Easy

↓

Medium

↓

Medium

↓

Hard

↓

Mastery
```

Reject

```
Hard

↓

Easy

↓

Hard

↓

Easy
```

---

# Stage 6 — Coverage Validator

Checks every syllabus point.

Example

```
Standard

1.1.3

Represent integers on number line
```

Lesson

```
Observation

Prediction

Reflection

Application
```

No number line.

Compiler says

```
ERROR

Standard not covered.
```

---

# Stage 7 — Asset Validator

Suppose screen says

```
animation:

number_line_drag
```

Compiler checks

```
assets/

number_line_drag.json
```

Missing?

```
ERROR

Missing asset

number_line_drag
```

---

# Stage 8 — Dependency Validator

Example

Lesson

```
Ordering Integers
```

Requires

```
Know Integer

Know Number Line
```

Compiler checks

```
dependency:

1.1.2

exists?

YES

dependency:

1.1.3

exists?

YES
```

Otherwise

```
Broken curriculum
```

---

# Stage 9 — Repetition Detector

LLMs repeat themselves.

```
Reflection

Reflection

Reflection

Reflection
```

Compiler

```
Similarity 92%

Rewrite recommended.
```

---

# Stage 10 — App Compatibility

Checks renderer compatibility.

```
screen.type

must be

multipleChoice

numberInput

dragNumberLine

reflection

simulation

...

```

Rejects

```
AIInventedScreenType
```

because your app can't render it.

---

# Output Report

Instead of just

```
PASS
```

generate something like

```
=====================================

Lesson

1.2.3

Mixed Integer Operations

=====================================

Schema

✅ PASS

Pedagogy

✅ PASS

Difficulty

⚠ Medium jumps to Hard too quickly

Coverage

✅ PASS

Assets

❌ Missing integer_chip_animation

Dependencies

✅ PASS

Flow

✅ PASS

Similarity

91%

Recommendation

Rewrite Reflection Screen 5

Overall

93/100

Production Ready

YES
```

---

# Even better: Build it like a compiler

```
Compiler/

schema.ts

validateSchema()

validateFlow()

validatePedagogy()

validateDifficulty()

validateCoverage()

validateDependencies()

validateAssets()

validateScreenTypes()

generateReport()

compileLesson()
```

Then your generation pipeline becomes:

```
Textbook JSON
        │
        ▼
AI Lesson Generator
        │
        ▼
Lesson JSON
        │
        ▼
Compiler
        │
   Pass? ───► Yes ─► Ship
        │
        ▼
Generate detailed error report
        │
        ▼
AI fixes only failed sections
        │
        ▼
Compile again
```

This is the architecture I'd recommend because it scales. Once the compiler exists, you can regenerate any chapter, switch to a different LLM, or update your lesson-generation prompt without manually reviewing every lesson. The compiler becomes the quality gate that enforces consistency across the entire curriculum.
