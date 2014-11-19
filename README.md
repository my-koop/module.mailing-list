module.mailing-list
===================

Mykoop module responsible to manage mailing lists


#Documentation

##Endpoints
- `GET /json/mailinglist`
  - See [GetMailingLists](#GetMailingList)
- `POST /json/mailinglist`
  - See [AddMailingLists](#AddMailingList)
- `PUT /json/mailinglist/:id`
  - See [UpdateMailingLists](#UpdateMailingList)
- `DELETE /json/mailinglist/:id`
  - See [DeleteMailingLists](#DeleteMailingList)

##Available Methods
###AddMailingList
```ts
addMailingList(
  params: {
    name: string;
    description?: string;
  },
  callback: (err?) => void
);
```
- params:
  - name: name of the mailing list
  - description: description of the mailing list
- callback: callback once the treatment is done
  - err: Error or null
- Possible errors:
  - app.name : `string;`
    - `"duplicate"`: name of the mailing already exists
  - validation.name: `string[];`
    - `"empty"`: name is empty
    - `"tooShort_#"`: name is too short, # is the minimal length
    - `"tooLong_#"`: name is too long, # is the maximal length

###UpdateMailingList
```ts
updateMailingList(
  params: {
    id: number;
    name: string;
    description?: string;
  },
  callback: (err?) => void
)
```
- params:
  - id: id of the mailing list
  - name: name of the mailing list
  - description: description of the mailing list
- callback: callback once the treatment is done
  - err: Error or null
- Possible errors:
  - app.name : `string;`
    - `"duplicate"`: name of the mailing already exists
  - app.id: `string;`
    - `"invalid"`: id is invalid
  - validation.id: `string[];`
    - `"notAnInteger"`: id is not an integer
    - `"NaN"`: id is not a number
  - validation.name: `string[];`
    - `"empty"`: name is empty
    - `"tooShort_#"`: name is too short, # is the minimal length
    - `"tooLong_#"`: name is too long, # is the maximal length

###DeleteMailingList
```ts
deleteMailingList(
  params: {
    id: number;
  },
  callback: (err?) => void
);
```
- params:
  - id: id of the mailing list to delete
- callback: callback once the treatment is done
  - err: Error or null
- Possible errors:
  - app.id : `string;`
    - `"invalid"`: id is invalid

###GetMailingList
```ts
getMailingLists(
  params: {},
  callback: (err?, result?: {id: number; name: string; description: string;}[]) => void
)
```
- params: empty
- callback: callback once the treatment is done
  - err: Error or null
  - result: list of mailing lists
    - id: id of the mailing list
    - name: name of the mailing list
    - description: description of the mailing list
