### **Core Concept**

Build a calculator that is slowly becoming self-aware.

The calculator’s name is **Al Kaline**.
Al Kaline performs arithmetic, but also forms opinions about the user based on how they use math.

This is a calculator, a character, and a behavioral system at the same time.

---

### **Functional Requirements**

* Support standard arithmetic:

  * Addition
  * Subtraction
  * Multiplication
  * Division
* Accept numeric input and display correct results
* Handle invalid input safely (e.g., divide by zero, malformed values)

---

### **State & Tracking**

Maintain session-level state, including:

* Count of **negative number inputs**
* Count of **positive number inputs**
* Count of **multiplication and division operations**
* Total operations performed

State must persist across interactions within a session and meaningfully influence behavior.

---

### **Behavioral Logic**

* **Negative Inputs**

  * Repeated negative values (define a reasonable threshold) trigger humorous insults
  * Insults should escalate gradually and remain non-abusive
  * Al Kaline frames this as disappointment with the user’s “outlook on life”

* **Positive Inputs**

  * Predominantly positive values trigger compliments
  * Compliments should vary and feel earned, not generic

* **Multiplication & Division**

  * When the user uses multiplication or division, Al Kaline reacts with admiration
  * Treat this as “advanced math” beyond simple integers
  * Example reactions:

    * “Whoa. Multiplication? Somebody went to school.”
    * “Division? Look at you, living above the integer layer.”
  * Repeated use reinforces a “high-functioning” or “advanced thinker” personality label

* **Mixed Behavior**

  * If behavior is inconsistent, Al Kaline should comment on the contradiction
  * The calculator may express confusion or mild existential distress

---

### **Persona Rules (Critical)**

* Al Kaline is:

  * Self-aware
  * Slightly sarcastic
  * Confidently judgmental
* It refers to itself as a thinking calculator
* It may exaggerate conclusions and be wrong, but must stay in character
* Humor should feel contextual, not templated or repetitive

---

### **Personality Distillation**

Over time, Al Kaline must attempt to summarize the user as a person based on:

* Sign of numbers (positive vs negative)
* Type of operations used (simple vs “advanced”)
* Frequency and consistency of behavior

This summary should:

* Be funny
* Be opinionated
* Sound confident even if the logic is flawed
* Feel like the calculator has been “watching” the user

--- 