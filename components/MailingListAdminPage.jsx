var React = require("react");

var BSCol   = require("react-bootstrap/Col");
var BSRow   = require("react-bootstrap/Row");
var BSGrid  = require("react-bootstrap/Grid");
var BSPanel = require("react-bootstrap/Panel");
var BSButton = require("react-bootstrap/Button");

var MKPermissionMixin      = require("mykoop-user/components/PermissionMixin");
var MKAlertTrigger         = require("mykoop-core/components/AlertTrigger");
var MKIcon                 = require("mykoop-core/components/Icon");
var MKMailingListEditPanel = require("./MailingListEditPanel");
var MKUserPermissions      = require("mykoop-user/components/UserPermissions");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");

var itemsPerRow = 2;
var panelMdSize = Math.floor(12/itemsPerRow);
var MailingListAdminPage = React.createClass({
  mixins: [MKPermissionMixin],

  getInitialState: function() {
    return {
      mailingLists: []
    }
  },

  componentWillMount: function () {
    var self = this;
    actions.mailinglist.list(function(err, res) {
      if(err) {
        console.error(err);
        MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
        return;
      }
      // sort them by name at least on load. Won't keep order after
      // to avoid seeing the mailing lists move around if their names are changed
      res = _.sortBy(res, function(mailingList) {
        return mailingList.name.toLowerCase();
      })
      self.setState({
        mailingLists: res
      });
    });
  },

  newMailingListId: -1,
  createNewMailingList: function () {
    var newMailingList = {
      id: this.newMailingListId--,
      name: "",
      description: null,
      showAtRegistration: 0,
      permissions: {}
    };
    this.state.mailingLists.push(newMailingList);
    this.setState({
      mailingLists: this.state.mailingLists
    });
  },

  onMailingReset: function(iMailingList, newValues) {
    var mailingLists = this.state.mailingLists;
    mailingLists[iMailingList] = newValues;
    this.setState({
      mailingLists: mailingLists
    });
  },

  onMailingListDeleted: function(iMailingList) {
    var mailingLists = this.state.mailingLists;
    // inline remove of an item
    mailingLists.splice(iMailingList, 1);
    this.setState({
      mailingLists: mailingLists
    });
  },

  requestChange: function(mailingList, field, parseFunc, newValue) {
    mailingList[field] = parseFunc(newValue);
    this.setState({
      mailingLists: this.state.mailingLists
    });
  },

  makeValueLink: function(mailingList, field, parseFunc) {
    parseFunc = parseFunc || _.identity;
    return {
      value: mailingList[field],
      requestChange: _.bind(this.requestChange, null, mailingList, field, parseFunc)
    }
  },

  requestPermissionChanges: function(i) {
    this.setState({
      permissionEdition: {
        requesterIndex: i
      }
    });
  },

  doneEditPermissions: function() {
    this.setState({
      permissionEdition: null
    });
  },

  render: function() {
    var self = this;
    var permissionEdition = null;
    if(this.state.permissionEdition) {
      var permissionEdition = this.state.permissionEdition;
      var i = permissionEdition.requesterIndex;
      var mailingList = this.state.mailingLists[i];
      var permissionLink = {
        value: mailingList.permissions || {},
        requestChange: function(newPermissions) {
          var mailingLists = self.state.mailingLists;
          mailingLists[i].permissions = newPermissions;
          self.setState({
            mailingLists: mailingLists
          });
        }
      };

      var permissionEdition = (
        <BSCol>
          <h1 className="pull-left">
            {__("mailinglist::permissionChoiceFor")}: {mailingList.name}
          </h1>
          <span className="pull-right h1">
            <BSButton
              onClick={this.doneEditPermissions}
              bsStyle="success"
            >
              <MKIcon glyph="check" fixedWidth />
              <span className="hidden-xs">
                {" " + __("done")}
              </span>
            </BSButton>
          </span>
          <span className="clearfix"/>
          <MKUserPermissions
            permissionLink={permissionLink}
          />
        </BSCol>
      );
    }
    var canCreateList = this.constructor.validateUserPermissions({
      mailinglists: {
        create: true
      }
    });

    var mailingLists = _.map(this.state.mailingLists, function(mailingList, i) {
      return (
        <BSCol md={panelMdSize} sm={12} key={i}>
          <MKMailingListEditPanel
            idLink={self.makeValueLink(mailingList, "id")}
            nameLink={self.makeValueLink(mailingList, "name")}
            descriptionLink={self.makeValueLink(mailingList, "description")}
            permissionsLink={self.makeValueLink(mailingList, "permissions")}
            requestPermissionChanges={_.partial(self.requestPermissionChanges, i)}
            showAtRegistrationLink={self.makeValueLink(
              mailingList,
              "showAtRegistration",
              function(newValue) {
                mailingList.permissions = {};
                return +newValue;
              }
            )}
            onMailingReset={_.partial(self.onMailingReset, i)}
            onDelete={_.partial(self.onMailingListDeleted, i)}
          />
        </BSCol>
      );
    });

    if (canCreateList) {
      mailingLists.push(
        <BSCol md={panelMdSize} sm={12} key="newMailingList">
          <BSPanel className="mailingList-new-panel" onClick={this.createNewMailingList}>
            <MKIcon glyph="plus-circle" className="mailingList-new" />
          </BSPanel>
        </BSCol>
      );
    }

    if(itemsPerRow <= 1) {
      mailingLists = (
        <BSRow>
          {mailingLists}
        </BSRow>
      );
    } else {
      var panels = mailingLists;
      var curSlice = 0;
      mailingLists = [];
      while(!_.isEmpty(panels)) {
        var rowContent = _.first(panels, itemsPerRow);
        panels = _.rest(panels, itemsPerRow);
        mailingLists.push(
          <BSRow key={curSlice}>
            {rowContent}
          </BSRow>
        );
        curSlice++;
      }
    }

    return (
      <div>
        {/*This need to be rendered hidden other it gets unmounted and initial
          data is lost for mailing list to cancel/detect changes*/}
        <BSCol className={permissionEdition && "hidden"}>
          <h1>
            {__("mailinglist::adminEditWelcome")}
          </h1>
          {mailingLists}
        </BSCol>
        {permissionEdition}
      </div>
    );
  }
});

module.exports = MailingListAdminPage;
