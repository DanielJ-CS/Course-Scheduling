# Development plan for Deliverable 1

## PUT operation

### Steps

1. Parse the zip file
2. Save to disk in our format

### Failure modes

1. cannot parse the zip file
2. wrong format (missing columns, or numbers, etc)
3. cannot save to disk

### File format design

* Store it as a big table, e.g. csv file (inefficient, but fix it later)

## query operation

### Steps

1. Parse the query according to spec
   * Represent filter using Composite Pattern
2. Load dataset from file (if not noded)
3. Filter the dataset according to query
4. Return result

### Failure modes

1. Dataset does not exist

## DELETE operation

Just delete the file

## To find out

* Ordering: ascending or descending
* Dataset size
* Any restrictions on error text

## Milestone 1: finish working prototype

* Implement PUT, DELETE, and dataset save/load operation
* Implement WHERE filter: represent + evaluate it on one entry
* Implement query + result presentation: column filter, sort, TABLE format

## Milestone 2: finish testing + fixing bugs

* Unit tests
* Integration tests
