Agent - JavaScript function interceptor
=======================================

Agent is a slim JavaScript library that allows observing function calls by hooking further code to be executed when an observed function is invoked.


Usage
-----

### observe()

Observes every time a given function or method is called, and attaches another function to be executed every time that happens. There are a number of arguments that can be passed to the observe function - the function signatures are as follows:

* `observe(fName, hook)`
* `observe(fName, hook, thisContext)`
* `observe(fName, hook, priority)`
* `observe(fName, hook, thisContext, priority)`
* `observe(o, fName, hook)`
* `observe(o, fName, hook, thisContext)`
* `observe(o, fName, hook, priority)`
* `observe(o, fName, hook, thisContext, priority)`

**Arguments:**

* **fName** _(string)_ Name of the function to observe. Example: `"onload"`.
* **hook** _(function)_ Function to be executed every time the observed function is called. Example: `function() { alert("Hi there"); }`.
* **o** _(object)_ Object that contains the function to observe. Example: `window`.
* **thisContext** _(object)_ The value of `this` to be applied to the hook function. Example: `MyObject`.
* **priority** _(number)_ Priority level of the hook, higher priorities will be executed before lower priorities. If two or more hooks have the same priority, they are executed on the order they were registered. Example: `10`.


### ignore()

Stops observing a previously hooked function:

* `ignore(fName, hook)`
* `ignore(o, fName, hook)`

**Arguments:**

* **fName** _(string)_ Name of the function containing the hook to ignore. Example: `"onload"`.
* **hook** _(function)_ Function previously hooked via the `observe()` method. Example: `myFunction`.
* **o** _(object)_ Object that contains the function to observe. Example: `window`.