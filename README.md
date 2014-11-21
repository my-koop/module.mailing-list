module.mailing-list
===================

Mykoop module responsible to manage mailing lists


#Documentation

##Endpoints
- `GET /json/mailinglists`
  - See [GetMailingLists](#getmailinglist)
- `POST /json/mailinglists`
  - See [AddMailingLists](#addmailinglist)
- `PUT /json/mailinglists/:id`
  - See [UpdateMailingLists](#updatemailinglist)
- `DELETE /json/mailinglists/:id`
  - See [DeleteMailingLists](#deletemailinglist)
- `POST /json/users/:id/mailinglists`
  - See [RegisterToMailingLists](#registertomailinglists)
- `DELETE /json/users/:id/mailinglists`
  - See [UnregisterToMailingLists](#unregistertomailinglists)
- `GET /json/users/:id/mailinglists`
  - See [GetUserMailingLists](#getusermailinglists)

##Available Methods
###AddMailingList
Creates a new mailing list with the provided name and description
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
Update the mailing list information
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
  - validation.name: `string[];`
    - `"empty"`: name is empty
    - `"tooShort__#__"`: name is too short, # is the minimal length
    - `"tooLong__#__"`: name is too long, # is the maximal length

###DeleteMailingList
Delete the mailing list and unlink all user from it
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

###GetMailingList
Retrieves all the mailing list available
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
Register the user to the mailing list
```ts
registerToMailingList(
  params: {
    idUser: number;
    idMailingList: number[];
  },
  callback: (err?) => void
)
```
- params:
  - idUser: id of the user that wants to register to the mailing list
  - idMailingList: list of id of the mailing lists to register to
- callback: callback once the treatment is done
  - err: Error or null

###UnregisterToMailingList
Unregister the user of the mailing lists
```ts
unregisterToMailingList(
  params: {
    idUser: number;
    idMailingList: number[];
  },
  callback: (err?) => void
)
```
- params:
  - idUser: id of the user
  - idMailingList: list of id of the mailing lists to unregister from
- callback: callback once the treatment is done
  - err: Error or null

###GetUserMailingLists
Get all the mailing list the user is registered to
```ts
registerToMailingList(
  params: {
    id: number;
  },
  callback: (err?, result?: {id: number;}[]) => void
)
```
- params:
  - id: id of the user
- callback: callback once the treatment is done
  - err: Error or null
  - result: list of mailing lists
    - id: id of the mailing list
