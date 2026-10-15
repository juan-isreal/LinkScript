# LinkScript (`.ls`) ⚡🐍

LinkScript is a lightweight, clean programming language that combines the familiar, elegant syntax of Python (`def`, `print`, native `f""` strings) with JavaScript's structural comfort (`{}` curly braces and `()` control flow). 

It eliminates whitespace/indentation errors and heavy configuration pipelines (`tsconfig.json`), compiling directly down to executable JavaScript.

---

## ✨ Features

- **Braces Over Whitespace:** Structural blocks use `{}` instead of indentation, so copy-pasting code never breaks execution.
- **Python-Style Functions & Printing:** Use `def` to declare functions and `print()` for console output.
- **Native F-Strings Everywhere:** Write `f"Hello, {username}!"` anywhere without dealing with JavaScript backticks or dollar signs (`${}`).
- **Hybrid & Strict Typing:**
  - **Dynamic:** Untyped variables (`score = 42`) remain flexible like Python.
  - **Strict:** Explicitly typed variables (`int score = 42` or `string name = "Link"`) lock their type. Assigning a mismatched type throws a strict type error.
- **True Constants:** Declaring a variable as `const` or `const int` ensures it is immutable, throwing a runtime `TypeError` if reassignment is attempted.

---

## 📊 Variable & Type Matrix

| Category | Syntax Example | Behavior |
| :--- | :--- | :--- |
| **Untyped Mutable** | `score = 42` | Flexible type, fully reassignable. |
| **Typed Mutable** | `int score = 42` | Strictly locked to `int`. Changing to `string` throws an error. |
| **Untyped Constant** | `const pi = 3.14` | Immutable. Reassignment throws a `TypeError`. |
| **Typed Constant** | `const int max_retries = 5` | Strictly locked type + immutable. |

*Supported types:* `int`, `float`, `long`, `string`, `bool`.

---

## 🚀 Quick Syntax Example (`app.ls`)

```python
# LinkScript Example (.ls)

# Variable Declarations
score = 100                      # Untyped mutable
string player_name = "VibeCoder" # Typed mutable
const float gravity = 9.8       # Untyped constant
const int max_health = 100      # Typed constant

# Function Definition
def calculate_score(bonus) {
    print(f"Calculating score for {player_name}...")
    return score + bonus
}

# Control Flow (Requires parentheses around conditions)
attempts = 3
while (attempts > 0) {
    if (score > 50) {
        print(f"Player {player_name} is crushing it! Current score: {score}")
    } else {
        print("Danger zone!")
    }
    
    attempts = attempts - 1
}

# Execution
final_result = calculate_score(25)
print(f"Final score: {final_result}")
```

---

## 🛠️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/linkscript.git
   cd linkscript
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run a LinkScript file:**
   ```bash
   node index.js app.ls
   ```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.