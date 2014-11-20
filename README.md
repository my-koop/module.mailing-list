module.mailing-list
===================

Mykoop module responsible to manage mailing lists


#Documentation

##Endpoints
- `GET /json/mailinglist`
  - See [GetMailingLists](#getmailinglist)
- `POST /json/mailinglist`
  - See [AddMailingLists](#addmailinglist)
- `PUT /json/mailinglist/:id`
  - See [UpdateMailingLists](#updatemailinglist)
- `DELETE /json/mailinglist/:id`
  - See [DeleteMailingLists](#deletemailinglist)
- `POST /json/mailinglist/:id/register`
  - See [RegisterToMailingList](#registertomailinglist)

##Available Methods
###AddMailingList
```ts
addMailingList(
  params: {
    name: string;
    description?: string;
  },
  callback: (err?, result?: {id: number}) => void
);
```
- params:
  - name: name of the mailing list
  - description: description of the mailing list
- callback: callback once the treatment is done
  - err: Error or null
  - result:
    - id: id of the newly created mailing list
- Possible errors:
  - app.name : `string;`
    - `"duplicate"`: name of the mailing already exists
  - validation.name: `string[];`
    - `"empty"`: name is empty
    - `"tooShort__#__"`: name is too short, # is the minimal length
    - `"tooLong__#__"`: name is too long, # is the maximal length

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
    - `"tooShort__#__"`: name is too short, # is the minimal length
    - `"tooLong__#__"`: name is too long, # is the maximal length

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
  - app.id: `string;`
    - `"invalid"`: id is invalid
  - validation.id: `string[];`
    - `"empty"`: mailing list id is missing
    - `"notAnInteger"`: mailing list id is not an integer
    - `"NaN"`: mailing list id is not a number

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

###RegisterToMailingList
```ts
registerToMailingList(
  params: {
    idUser: number;
    idMailingList: number;
  },
  callback: (err?) => void
)
```
- params:
  - idUser: id of the user that wants to register to the mailing list
  - idMailingList: id of the mailing list to register to
- callback: callback once the treatment is done
  - err: Error or null
- Possible errors:
  - app.idUser: `string;`
    - `"invalid"`: user id is invalid
    - `"alreadyRegistered"`: user is already registered to the mailing list
  - app.idMailingList: `string;`
    - `"invalid"`: mailing list id is invalid
  - validation.id: `string[];`
    - `"empty"`: mailing list id is missing
    - `"notAnInteger"`: mailing list id is not an integer
    - `"NaN"`: mailing list id is not a number
  - validation.idUser: `string[];`
    - `"empty"`: user id is missing
    - `"notAnInteger"`: user id is not an integer
    - `"NaN"`: user id is not a number
