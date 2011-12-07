Agent - JavaScript function interceptor
=======================================

Agent is a slim JavaScript library that allows observing function calls by hooking further code to be executed when an observed function is invoked.

Agent can be used as an [aspect-oriented programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming) tool, as it enables definition of advices (hook functions) that can be linked to join points (observed functions). Practical AOP applications include logging, persistance and authentication.


Usage
-----

`Agent` is provided as a simple JavaScript object containing 2 public methods:  


### Agent.observe()

Observes every time a given function or method is called, and attaches another function to be executed when that happens. A hook function can only be added once to a given observed function, subsequent attempts to add the same hook function will be ignored.

The supported method signatures are:

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
* **hook** _(function)_ Function to be executed when the observed function is called. Example: `function() { alert("Hi there"); }`.
* **o** _(object)_ Object that contains the function to observe (defined by `fName`). Example: `window`.
* **thisContext** _(object)_ Value of `this` to be applied to the hook function. Example: `MyObject`.
* **priority** _(number)_ Priority level of the hook, higher priorities will be executed before lower priorities. If two or more hooks have the same priority, they are executed on the order they were registered. Example: `10`.


### Agent.ignore()

Stops observing a previously hooked function:

* `ignore(fName, hook)`
* `ignore(o, fName, hook)`

**Arguments:**

* **fName** _(string)_ Name of the function holding the hook to ignore. Example: `"onload"`.
* **hook** _(function)_ Function previously hooked via the `observe()` method. Example: `myFunction`.
* **o** _(object)_ Object that contains the function to observe. Example: `window`.


Examples
--------

The following examples show some practical usages of Agent. All the examples are available in the test directory.

---

### Wrapping window.onload:

    window.onload = function() {
      alert("Default window.onload");
    };

    Agent.observe("onload", function() {
      alert("Hooked function");
    });

---

### Logging every time jQuery.append is called:

    $(function() {
        
        // Observing the append method on jQuery's prototype.
        Agent.observe($.prototype, "append", function(content) {
            if (window.console && (typeof window.console.log == "function"))
                window.console.log("jquery.append called with parameter: " + content);
        });
        
        $("body").append("<h1>Hello World!</h1>");
        
    });