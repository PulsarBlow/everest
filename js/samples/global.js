(function ($, ko, ê) {
    var host = "api.github.com",
        defaultResourcePath = "/repos/PulsarBlow/everest.js/releases",
        $loader,
        restApi = ê.createRestClient({
            host: host,
            useSSL: true     // Set SSL on because github requires it
        });

    function ViewModel() {
        this.host = ko.observable(host);
        this.resourcePath = ko.observable(defaultResourcePath);
        this.result = ko.observable("");
        this.canPost = ko.computed(function(){
            return this.host() && this.resourcePath()
        }, this);
    }

    ViewModel.prototype.readResource = function () {
        var that = this;

        // Reset the host (in case your changed it in the input field)
        restApi.setConfiguration({host: that.host()});

        // Triggers the read and handles the outcome
        $loader.removeClass("hidden");
        restApi.read(that.resourcePath())
            .done(function (data) {
                that.result(JSON.stringify(data));
                console.log("ResApiClient read success", data);

                // Highlight response
                $('pre.highlight').each(function (i, block) {
                    hljs.highlightBlock(block);
                });
            })
            .fail(function () {
                console.log("RestApiClient read fail", arguments);
            })
            .always(function () {
                console.log("RestApiClient read completed");
                $loader.addClass("hidden");
            });
    };

    $(document).ready(function () {
        $loader = $("#loader");
        // ViewModel data binding.
        // Just some Knockout stuff here, nothing related to EverestJs
        ko.applyBindings(new ViewModel());

    });
})(window.jQuery = window.jQuery || {}, window.ko = window.ko || {}, window.ê = window.ê || {});