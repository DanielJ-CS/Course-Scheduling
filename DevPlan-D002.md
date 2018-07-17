# Development plan for Deliverable 2

## Main tasks

* Refactor with InsightFacade
* Add `courses_uuid`
* Implement GROUP, APPLY, ORDER (keep both new and old usage)
* Write unit tests for all code

### course uuid

Simple change to DatasetController.ts, already done

### GROUP and APPLY

Important notes:
* GET must contain ids in GROUP or APPLY
* COUNT in APPLY is unique count
* MAX/MIN/AVG -> numeric, COUNT -> numeric/string

### ORDER

Important notes:
* Support both versions
* D1 version: just column, ascending by default
* D2 version: direction + list of columns
