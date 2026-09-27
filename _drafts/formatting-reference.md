---
title: Formatting reference
description: Everything Markdown can do on this site, in one place. Drafts are never published, so keep this around as a cheat sheet.
tags: [reference, writing]
---

Opening paragraphs set in the reading serif. **Bold**, *italic*, `inline code`, and [links](https://github.com) all work as you'd expect. Footnotes too.[^1]

## A second-level heading

Short paragraphs read best on screen. Break long arguments into sections with `##` headings; they show up in the sans-serif UI face.

### Lists

- Unordered lists get teal markers
- Keep items parallel
  - Nested items work

1. Ordered lists
2. Number themselves
3. Automatically

> Block quotes get a teal rule and italic type, good for pulling out a key line or quoting a source.

---

### Code

```python
def runway(cash: float, monthly_burn: float) -> float:
    """Months of runway at the current burn rate."""
    if monthly_burn <= 0:
        return float("inf")
    return round(cash / monthly_burn, 1)  # e.g. 18.4
```

### Tables

| Quarter | Revenue | Margin |
|---------|--------:|-------:|
| Q1      | $1.20M  | 38%    |
| Q2      | $1.35M  | 41%    |

### Images

Put image files in `assets/images/` and reference them like this:

```markdown
{% raw %}![Alt text describing the image]({{ '/assets/images/example.jpg' | relative_url }}){% endraw %}
```

[^1]: Footnotes collect at the bottom of the article.
