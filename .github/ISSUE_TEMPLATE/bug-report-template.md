---
name: Bug report template
about: Create a report to help us improve the extension
title: ''
labels: bug
assignees: ''

---

This is a template, the template is designed to help give you an outline to what should be in this bug report.

It needs to have the following included:
* Extensions current version (can be found in settings)
* Console output (CTRL + I, then go to `Console` and copy all data there)
* Explain in detail what you do to cause the bug

Example:

Issue title: Help! Echo+ can't access github.com
Contents:
Version: `v0.2.9`

For some reason Echo+ cannot access github? The stylesheets won't work because of it. It seems to only happen when on this part of echo `https://example.com`.

Console (these do not relate to the example, they are just placeholder): 
```text
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://echo-ntn.zendesk.com/embeddable/config. (Reason: CORS request did not succeed). Status code: (null).

The resource at “<URL>” was blocked because content blocking is enabled. 2
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://echo-ntn.zendesk.com/frontendevents/dl?client=1B752747-577B-429A-A0E0-83861AF69088. (Reason: CORS request did not succeed). Status code: (null).

Uncaught (in promise) TypeError: NetworkError when attempting to fetch resource. 
```

Hope you understand the template, please `CTRL + A` and delete all this to begin typing your bug.
