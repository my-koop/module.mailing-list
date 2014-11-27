var React = require("react");

var BSCol   = require("react-bootstrap/Col");
var BSRow   = require("react-bootstrap/Row");
var BSGrid  = require("react-bootstrap/Grid");
var BSPanel = require("react-bootstrap/Panel");

var MKAlertTrigger         = require("mykoop-core/components/AlertTrigger");
var MKIcon                 = require("mykoop-core/components/Icon");
var MKMailingListEditPanel = require("./MailingListEditPanel");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");

var MailingListAdminPage = React.createClass({
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
      })
    });
  },

  newMailingListId: -1,
  createNewMailingList: function () {
    var newMailingList = {
      id: this.newMailingListId--,
      name: "",
      description: null,
      showAtRegistration: 0
    };
    this.state.mailingLists.push(newMailingList);
    this.setState({
      mailingLists: this.state.mailingLists
    });
  },

  mailingListDeleted: function(iMailingList) {
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
      requestChange: _.bind(this.requestChange, this, mailingList, field, parseFunc)
    }
  },

  render: function() {
    var self = this;
    var mailingLists = _.map(this.state.mailingLists, function(mailingList, i) {
      return (
        <BSCol md={6} sm={12} key={i}>
          <MKMailingListEditPanel
            idLink={self.makeValueLink(mailingList, "id")}
            nameLink={self.makeValueLink(mailingList, "name")}
            descriptionLink={self.makeValueLink(mailingList, "description")}
            showAtRegistrationLink={self.makeValueLink(
              mailingList,
              "showAtRegistration",
              function(newValue) {
                return +newValue;
              }
            )}
            onDelete={_.bind(self.mailingListDeleted, self, i)}
          />
        </BSCol>
      );
    });
    return (
      <BSCol>
        <h1>
          {__("mailinglist::adminEditWelcome")}
        </h1>
        <BSRow>
          {mailingLists}
          <BSCol md={6} sm={12} key="newMailingList">
            <BSPanel className="mailingList-new-panel" onClick={this.createNewMailingList}>
              <MKIcon glyph="plus-circle" className="mailingList-new" />
            </BSPanel>
          </BSCol>
        </BSRow>
      </BSCol>
    );
  }
});

module.exports = MailingListAdminPage;
