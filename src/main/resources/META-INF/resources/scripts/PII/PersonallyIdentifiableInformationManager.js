function PersonallyIdentifiableInformationManager(source, type, hasPdf = false) {
    this.reviewPopup;
    this.reviewPopup2;
    this.reviewPopup3;
    this.reviewPdfPopup;
    this.reportPdfPopup;
    this.source = source;
    this.dialogs = [];
    this.snapshots = [];
    this.pdfs = [];
    this.type = type;
    this.hasPdf = hasPdf;

    this.showPage1 = function () {
        if (typeof this.reviewPopup2 !== "undefined") {
            this.reviewPopup2.hide();
        }
        if (typeof this.reviewPopup3 !== "undefined") {
            this.reviewPopup3.hide();
        }
        if (typeof this.reviewPdfPopup !== "undefined") {
            this.reviewPdfPopup.hide();
        }
        if (typeof this.reportPdfPopup !== "undefined") {
            this.reportPdfPopup.hide();
        }

        if (this.dialogs.indexOf(this.reviewPopup) != -1) {

            this.reviewPopup.show();
        } else {


            //this.popupLoader=prependLoader("pii_header","Preparing ..");
            //this.popupLoader.render();
            var popupDIV = document.createElement("DIV");
            popupDIV.id = "dicom_popup";
            var popupHD = document.createElement("DIV");
            popupHD.className = "hd";
            popupDIV.appendChild(popupHD);
            var popupBD = document.createElement("DIV");
            popupBD.className = "bd";
            popupBD.id = "dicom_popupbody";
            popupDIV.appendChild(popupBD);

            popupHD.innerHTML = "Please Review Personally Identifiable Information (PII) ";

            var div1 = document.createElement("DIV");
            div1.style.display = 'block';
            div1.innerHTML = 'Review Step 1: Please review the images to confirm that no personally identifiable information (PII) is present in the uploaded files. Please note that images with PII embedded in the image cannot be accepted by the system.';
            popupBD.appendChild(div1);


            var dicom_summary_table_popup = document.createElement("div");
            dicom_summary_table_popup.id = "dicom_summary_table_popup";
            dicom_summary_table_popup.style.marginTop = "5px";
            popupBD.appendChild(dicom_summary_table_popup);

            //add to page
            var dicom_summary_page1 = document.getElementById("dicom_summary_page1");
            dicom_summary_page1.appendChild(popupDIV);

            this.reviewPopup = new YAHOO.widget.Dialog(popupDIV, {
                zIndex: 999,
                visible: false,
                height: "720px",
                width: "820px",
                fixedcenter: true
            });


            var myButtons = [{text: "Continue", handler: this.handleSubmitPage1, isDefault: true}];
            this.reviewPopup.cfg.queueProperty("buttons", myButtons);


            var snapshot_results = document.createElement("div");
            snapshot_results.id = "snapshot_results";
            snapshot_results.style.marginTop = "5px";
            popupBD.appendChild(snapshot_results);

            this.reviewPopup.snapshotColumnDefs = [
                {key: "id", label: "id", sortable: true},
                {key: "Size", label: "Size", sortable: true},
                {key: "URI", label: "Snapshot", formatter: snapshotFormatter}
            ];


            this.reviewPopup.snapshotDataSource = new YAHOO.util.DataSource(serverRoot + "/data/services/pii");
            this.reviewPopup.snapshotDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
            this.reviewPopup.snapshotDataSource.responseSchema = {
                resultsList: "ResultSet.Result",
                fields: ["id", "Name", "URI", "Size"]
            };

            this.reviewPopup.snapshotDataTable = new YAHOO.widget.DataTable("snapshot_results", this.reviewPopup.snapshotColumnDefs, this.reviewPopup.snapshotDataSource, {
                scrollable: "y",
                width: "800px",
                height: "550px",
                initialRequest: this.source + "/snapshots?format=json&XNAT_CSRF=" + csrfToken
            });


            this.reviewPopup.render();

            this.reviewPopup.show();
            this.dialogs.push(this.reviewPopup);

        }
    };


    this.showPage2 = function () {
        if (typeof this.reviewPopup !== "undefined") {
            this.reviewPopup.hide();
        }
        if (typeof this.reviewPopup3 !== "undefined") {
            this.reviewPopup3.hide();
        }
        if (typeof this.reviewPdfPopup !== "undefined") {
            this.reviewPdfPopup.hide();
        }
        if (typeof this.reportPdfPopup !== "undefined") {
            this.reportPdfPopup.hide();
        }

        if (this.dialogs.indexOf(this.reviewPopup2) != -1) {
            this.reviewPopup2.show();
        } else {


            //this.popupLoader=prependLoader("pii_header","Preparing ..");
            //this.popupLoader.render();
            var popupDIV = document.createElement("DIV");
            popupDIV.id = "dicom_popup2";
            var popupHD = document.createElement("DIV");
            popupHD.className = "hd";
            popupDIV.appendChild(popupHD);
            var popupBD = document.createElement("DIV");
            popupBD.className = "bd";
            popupBD.id = "dicom_popupbody2";
            popupDIV.appendChild(popupBD);

            popupHD.innerHTML = "Please Review Personally Identifiable Information (PII) ";

            var div1 = document.createElement("DIV");
            div1.style.display = 'block';
            div1.innerHTML = 'Review Step 2: Please review the metadata and confirm that no personally identifiable information (PII) is present in the uploaded files.';
            popupBD.appendChild(div1);


            var dicom_summary_table_popup2 = document.createElement("div");
            dicom_summary_table_popup2.id = "dicom_summary_table_popup2";
            dicom_summary_table_popup2.style.marginTop = "5px";
            popupBD.appendChild(dicom_summary_table_popup2);

            //add to page
            var dicom_summary_page2 = document.getElementById("dicom_summary_page2");
            dicom_summary_page2.appendChild(popupDIV);

            this.reviewPopup2 = new YAHOO.widget.Dialog(popupDIV, {
                zIndex: 999,
                visible: false,
                height: "720px",
                width: "820px",
                fixedcenter: true
            });


            var myButtons = [{text: "Back", handler: this.handleCancelPage2},
                {text: "Confirm", handler: this.handleConfirm},
                {text: "Report PII", handler: this.handleSubmitPage2, isDefault: true}];
            this.reviewPopup2.cfg.queueProperty("buttons", myButtons);


            this.reviewPopup2.dicom_summary_table = document.getElementById("dicom_summary_table_popup2");


            this.reviewPopup2.dicomColumnDefs = [
                {key: "tag1", label: "Tag", sortable: true},
                {key: "desc", label: "Description", sortable: true},
                {key: "value", label: "Value", sortable: true}
            ];


            this.reviewPopup2.dicomDataSource = new YAHOO.util.DataSource(serverRoot + "/data/services/" + this.type + "dump?");
            this.reviewPopup2.dicomDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
            this.reviewPopup2.dicomDataSource.responseSchema = {
                resultsList: "ResultSet.Result",
                fields: ["tag2", "desc", "value", "vr", "tag1"]
            };

            this.reviewPopup2.dicomDataTable = new YAHOO.widget.DataTable("dicom_summary_table_popup2", this.reviewPopup2.dicomColumnDefs, this.reviewPopup2.dicomDataSource, {
                scrollable: "y",
                width: "800px",
                height: "550px",
                initialRequest: "src=" + this.source + "&summary=true&format=json"
            });


            this.reviewPopup2.render();

            this.reviewPopup2.show();
            this.dialogs.push(this.reviewPopup2);

        }

    };

    this.refreshPage3Content = function () {
        var checks = window.PIIManager.getCheckedBoxes("tags")
        var stags = '';
        for (var i in checks) {
            if (typeof checks[i].value !== 'undefined') {
                stags = stags + ' ' + checks[i].value;
            }
        }
        var thebody = "<table><tr><th class=\"formLabel\">Tags: </th><td>" + stags + "</td></tr>";
        thebody = thebody + "<tr>";
        thebody = thebody + "<th class=\"formLabel\">Notes</th>";
        thebody = thebody + "<td><textarea id=\"pii_note\" name=\"pii_note\" rows=\"4\" cols=\"50\" style=\"text-align:left;\"></textarea></td>";
        thebody = thebody + "</tr>";
        thebody = thebody + "</TABLE>";
        this.reviewPopup3.setBody("Report the following tags and delete the session: <br>" + thebody);


    }
    this.showPage3 = function () {
        if (typeof this.reviewPopup !== "undefined") {
            this.reviewPopup.hide();
        }
        if (typeof this.reviewPopup2 !== "undefined") {
            this.reviewPopup2.hide();
        }
        if (typeof this.reviewPdfPopup !== "undefined") {
            this.reviewPdfPopup.hide();
        }
        if (typeof this.reportPdfPopup !== "undefined") {
            this.reportPdfPopup.hide();
        }

        if (this.dialogs.indexOf(this.reviewPopup3) != -1) {
            this.reviewPopup3.show();
        } else {

            var popupDIV = document.createElement("DIV");
            popupDIV.id = "dicom_popup3";
            var popupHD = document.createElement("DIV");
            popupHD.className = "hd";
            popupDIV.appendChild(popupHD);
            var popupBD = document.createElement("DIV");
            popupBD.className = "bd";
            popupBD.id = "dicom_popup3body";

            popupDIV.appendChild(popupBD);

            popupHD.innerHTML = "Please Select Personally Identifiable Information (PII) ";

            var div1 = document.createElement("DIV");
            div1.style.display = 'block';
            div1.innerHTML = 'Thank you for reporting PII in the uploaded files. The files will be removed from the system.  To assist in resolving this issue, please mark the fields below that contain PII.  The site administrator will be notified and will correct the system configuration.  You will receive an email from the administrator when the files can be reuploaded. For files with PII embedded in the image (such as screen captures), please remove those extra images and reupload.';
            popupBD.appendChild(div1);


            var dicom_summary_table_popup3 = document.createElement("div");
            dicom_summary_table_popup3.id = "dicom_summary_table_popup3";
            dicom_summary_table_popup3.style.marginTop = "5px";
            popupBD.appendChild(dicom_summary_table_popup3);

            //add to page
            var dicom_summary_page3 = document.getElementById("dicom_summary_page3");
            dicom_summary_page3.appendChild(popupDIV);

            this.reviewPopup3 = new YAHOO.widget.Dialog(popupDIV, {
                zIndex: 999,
                visible: false,
                height: "720px",
                width: "820px",
                fixedcenter: true
            });


            var myButtons = [{text: "Back", handler: this.handleCancelPage3},
                {text: "Submit", handler: this.handleSubmitPage3, isDefault: true}];
            this.reviewPopup3.cfg.queueProperty("buttons", myButtons);


            this.reviewPopup3.dicom_summary_table = document.getElementById("dicom_summary_table_popup3");


            this.reviewPopup3.dicomColumnDefs = [
                {key: "tag1", label: "Select", formatter: tagFormatter},
                {key: "tag1", label: "Tag", sortable: true},
                {key: "desc", label: "Description", sortable: true},
                {key: "value", label: "Value", sortable: true}
            ];


            this.reviewPopup3.dicomDataSource = new YAHOO.util.DataSource(serverRoot + "/data/services/" + this.type + "dump?");
            this.reviewPopup3.dicomDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
            this.reviewPopup3.dicomDataSource.responseSchema = {
                resultsList: "ResultSet.Result",
                fields: ["tag2", "desc", "value", "vr", "tag1"]
            };

            this.reviewPopup3.dicomDataTable = new YAHOO.widget.DataTable("dicom_summary_table_popup3", this.reviewPopup3.dicomColumnDefs, this.reviewPopup3.dicomDataSource, {
                scrollable: "y",
                width: "800px",
                height: "350px",
                initialRequest: "src=" + this.source + "&summary=true&format=json"
            });


            var thenotesdiv = "<DIV class=\"edit_header1\"><br>Notes</DIV><div>";
            thenotesdiv = thenotesdiv + "<table width=\"100%\"><tr>";
            thenotesdiv = thenotesdiv + "<td><textarea  id=\"pii_note\" name=\"pii_note\" rows=\"6\"  style=\"text-align:left;max-width=820px;width:99%;\"></textarea></td>";
            thenotesdiv = thenotesdiv + "</tr>";
            thenotesdiv = thenotesdiv + "</TABLE></div>";


            jq('#dicom_popup3body').append(thenotesdiv);

            this.reviewPopup3.render();

            this.reviewPopup3.show();
            this.dialogs.push(this.reviewPopup3);
        }

    };


    this.showPdfReview = function () {
        if (typeof this.reviewPopup !== "undefined") {
            this.reviewPopup.hide();
        }
        if (typeof this.reviewPopup2 !== "undefined") {
            this.reviewPopup2.hide();
        }
        if (typeof this.reviewPopup3 !== "undefined") {
            this.reviewPopup3.hide();
        }
        if (typeof this.reportPdfPopup !== "undefined") {
            this.reportPdfPopup.hide();
        }

        if (this.dialogs.indexOf(this.reviewPdfPopup) != -1) {
            this.reviewPdfPopup.show();
        } else {
            var popupDIV = document.createElement("DIV");
            popupDIV.id = "reviewPdfPopup";
            var popupHD = document.createElement("DIV");
            popupHD.className = "hd";
            popupDIV.appendChild(popupHD);
            var popupBD = document.createElement("DIV");
            popupBD.className = "bd";
            popupBD.id = "reviewPdfPopupBody";
            popupDIV.appendChild(popupBD);

            popupHD.innerHTML = "Please Review Personally Identifiable Information (PII) ";

            var div1 = document.createElement("DIV");
            div1.style.display = 'block';
            div1.innerHTML = 'Please review the pdf file(s) and confirm that no personally identifiable information (PII) is present.';
            popupBD.appendChild(div1);

            var pdf_summary_table = document.createElement("div");
            pdf_summary_table.id = "pdf_summary_table";
            pdf_summary_table.style.marginTop = "5px";
            popupBD.appendChild(pdf_summary_table);

            //add to page
            var pdf_summary = document.getElementById("pdf_summary");
            pdf_summary.appendChild(popupDIV);

            this.reviewPdfPopup = new YAHOO.widget.Dialog(popupDIV, {
                zIndex: 999,
                visible: false,
                height: "720px",
                width: "820px",
                fixedcenter: true
            });

            var myButtons = [
                {text: "Confirm", handler: this.handleConfirmPdf},
                {text: "Report PII", handler: this.handlePIIPdf, isDefault: true}];
            this.reviewPdfPopup.cfg.queueProperty("buttons", myButtons);

            var results = document.createElement("div");
            results.id = "pdf_results";
            results.style.marginTop = "5px";
            popupBD.appendChild(results);

            this.reviewPdfPopup.columnDefs = [
                {key: "PDF", label: "PDF", formatter: pdfFormatter}
            ];

            this.reviewPdfPopup.dataSource = new YAHOO.util.DataSource(serverRoot + "/data/services/pii");
            this.reviewPdfPopup.dataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
            this.reviewPdfPopup.dataSource.responseSchema = {
                resultsList: "ResultSet.Result",
                fields: ["Name", "URI"]
            };

            this.reviewPdfPopup.dataTable = new YAHOO.widget.DataTable(results.id,
                this.reviewPdfPopup.columnDefs,
                this.reviewPdfPopup.dataSource,
                {
                    scrollable: "y",
                    width: "800px",
                    height: "550px",
                    initialRequest: this.source + "/pdf?format=json&XNAT_CSRF=" + csrfToken
                });

            this.reviewPdfPopup.render();

            this.reviewPdfPopup.show();
            this.dialogs.push(this.reviewPdfPopup);
        }
    };

    this.showPdfPIIReport = function () {
        if (typeof this.reviewPopup !== "undefined") {
            this.reviewPopup.hide();
        }
        if (typeof this.reviewPopup2 !== "undefined") {
            this.reviewPopup2.hide();
        }
        if (typeof this.reviewPopup3 !== "undefined") {
            this.reviewPopup3.hide();
        }
        if (typeof this.reviewPdfPopup !== "undefined") {
            this.reviewPdfPopup.hide();
        }

        if (this.dialogs.indexOf(this.reportPdfPopup) != -1) {
            this.reportPdfPopup.show();
        } else {
            const bodyId = "reportPdfPopupBody";
            var popupDIV = document.createElement("DIV");
            popupDIV.id = "reportPdfPopup";
            var popupHD = document.createElement("DIV");
            popupHD.className = "hd";
            popupDIV.appendChild(popupHD);
            var popupBD = document.createElement("DIV");
            popupBD.className = "bd";
            popupBD.id = bodyId;

            popupDIV.appendChild(popupBD);

            popupHD.innerHTML = "Please Select Personally Identifiable Information (PII) ";

            var div1 = document.createElement("DIV");
            div1.style.display = 'block';
            div1.innerHTML = 'Thank you for reporting PII in the uploaded file(s). Any files selected below will be ' +
                'removed from the system. Without using PII, please explain specifically why you flagged the file(s) ' +
                'to facilitate correction and reupload. After submitting this report, you may proceed with archiving ' +
                'the session.';
            popupBD.appendChild(div1);

            var pdf_report_table = document.createElement("div");
            pdf_report_table.id = "pdf_report_table";
            pdf_report_table.style.marginTop = "5px";
            popupBD.appendChild(pdf_report_table);

            //add to page
            var pdf_report = document.getElementById("pdf_report");
            pdf_report.appendChild(popupDIV);

            this.reportPdfPopup = new YAHOO.widget.Dialog(popupDIV, {
                zIndex: 999,
                visible: false,
                height: "720px",
                width: "820px",
                fixedcenter: true
            });

            var myButtons = [{text: "Back", handler: this.handleCancelPdfReport},
                {text: "Submit", handler: this.handleSubmitPdfReport, isDefault: true}];
            this.reportPdfPopup.cfg.queueProperty("buttons", myButtons);


            const pdfInput = '<br><h3>PDF</h3><div><label>Select all pdfs containing PII:</label><br>' +
                    '<select multiple="true" id="pii_pdf_select">' + this.pdfs.map(pdf => '<option selected="selected" ' +
                        'value="' + pdf + '">' + getResource(pdf) + '/' + pdf.replace(/.*\//, '') + '</option>') + '</select></div>'
            var thenotesdiv = "<br><h3>Notes</h3>";
            thenotesdiv = thenotesdiv + "<div><table width=\"100%\"><tr>";
            thenotesdiv = thenotesdiv + "<td><textarea  id=\"pii_pdf_note\" rows=\"6\"  style=\"text-align:left;max-width=820px;width:99%;\"></textarea></td>";
            thenotesdiv = thenotesdiv + "</tr>";
            thenotesdiv = thenotesdiv + "</table></div>";

            jq('#' + bodyId).append(pdfInput, thenotesdiv);

            this.reportPdfPopup.render();

            this.reportPdfPopup.show();
            this.dialogs.push(this.reportPdfPopup);
        }

    };

    var tagFormatter = function (elCell, oRecord, oColumn, oData) {
        var imgUrl = serverRoot + "/images/qm.gif";
        var id = oRecord.getData('tag1')
        elCell.innerHTML = ' <input  type="checkbox" value="' + id + '"  ID="' + id + '" name="tags"/>';
    };


    this.handleSubmitPage1 = function () {
        window.PIIManager.showPage2();
    };

    this.handleConfirm = function () {
        if (window.PIIManager.hasPdf) {
            window.PIIManager.showPdfReview();
        } else {
            window.PIIManager.close(this);
        }
    };

    this.handleConfirmPdf = function () {
        window.PIIManager.close(this);
    }

    this.close = function (dialog) {
        //set hidden field for pii confirmed....
        $("#checkboxphi").attr("checked", true);
        dialog.hide();//need function to set confirm checkbox...
    }

    this.handlePIIPdf = function () {
        window.PIIManager.showPdfPIIReport();
    }

    this.handleSubmitPage2 = function () {
        window.PIIManager.showPage3();
    };

    this.handleCancelPage2 = function () {
        window.PIIManager.showPage1();
    };


    this.handleCancelPage3 = function () {
        window.PIIManager.showPage2();
    };

    this.handleSubmitPage3 = function () {
        //need function to send email and delete.
        window.PIIManager.requestPIIReport();
    };

    this.handleCancelPdfReport = function () {
        window.PIIManager.showPdfReview();
    }

    this.handleSubmitPdfReport = function () {
        const pdfs = $('#pii_pdf_select').val()
        xModalConfirm({
            content: "Are you sure you want submit the report and delete the pdf?",
            okAction: function () {
                window.PIIManager.doSubmitReport("/REST/services/pii/pdf_report", "#pii_pdf_note",
                    {source: window.PIIManager.source, pdfs: pdfs.map(pdf => pdf.replace(/.*\//, ""))});
                window.PIIManager.doDelete(pdfs, "Deleting PDF", "PDF deleted", false);
            },
            cancelAction: function () {
            }
        });
    }

    this.requestPIIReport = function () {

        xModalConfirm({
            content: "Are you sure you want submit the report and delete the session?",
            okAction: function () {
                window.PIIManager.doSubmitReport("/REST/services/pii/report");
                window.PIIManager.doDelete(["/REST" + window.PIIManager.source], "Deleting session", "Session deleted");
            },
            cancelAction: function () {
            }
        });
    };
    this.doDelete = function (uris, message, successMsg, redirect) {
        const onSuccess = function () {
            window.PIIManager.handleDelSuccess(successMsg, redirect);
        };
        this.delCallback = {
            success: onSuccess,
            failure: this.handleDelFailure,
            cache: false, // Turn off caching for IE
            scope: this
        };

        openModalPanel("delete_session", message);

        if (uris.length > 1) {
            const deletes = uris.map(uri => $.ajax({url: XNAT.url.csrfUrl(uri), method: 'DELETE'}));
            $.when(...deletes).then(onSuccess, window.PIIManager.handleDelFailure);
        } else {
            YAHOO.util.Connect.asyncRequest('DELETE', serverRoot + uris[0] + "?XNAT_CSRF=" + csrfToken, this.delCallback, null, this);
        }
    };
    this.handleDelSuccess = function (title, redirect = true) {
        closeModalPanel("delete_session");
        let message = 'The site administrator has been notified and will contact you when the issues have been resolved.';
        if (!redirect) {
            message += ' The file(s) you identified as having PII have been removed. You may continue to archive the session.'
        }
        xModalMessage(title, message, 'OK', {
            okAction: function () {
                if (redirect) {
                    window.location.href = serverRoot + "/app/template/Index.vm";
                } else {
                    $('.resources-table').remove();
                    const resources = $('#pii_pdf_select option:not(:selected)').map(function() {
                        return getResource($(this).val());
                    }).get().filter((v, i, self) => self.indexOf(v) === i);
                    XNAT.app.prearchiveActions.buildResourceTable(resources);
                    window.PIIManager.close(window.PIIManager.reportPdfPopup);
                }
            }
        });
    };
    this.handleDelFailure = function (o) {
        closeModalPanel("delete_session");
        showMessage("page_body", "Error", "Failed to delete requested files (" + o.message + "). " +
            "Please stop here and contact the site administrator.");
    };

    this.doSubmitReport = function (url, noteId = '#pii_note', prm = {}) {

        this.submitCallback = {
            success: this.handleSubmitSuccess,
            failure: this.handleSubmitFailure,
            cache: false, // Turn off caching for IE
            scope: this
        };

        openModalPanel("report_session", "Sending Report");
        //add params...
        prm.notes = jq.trim(jq(noteId).val());
        prm.tags = window.PIIManager.getTags();
        const params = new URLSearchParams(prm).toString();

        YAHOO.util.Connect.asyncRequest('POST', serverRoot + url + "?XNAT_CSRF=" + csrfToken + "&" + params, this.submitCallback, null, this);

    };

    this.getTags = function () {
        var checks = this.getCheckedBoxes("tags")
        var stags = '';
        for (var i in checks) {
            if (typeof checks[i].value !== 'undefined') {
                stags = stags + ' ' + checks[i].value;
            }
        }
        return stags;
    };

    this.handleSubmitSuccess = function (o) {
        closeModalPanel("report_session");
    };

    this.handleSubmitFailure = function (o) {
        closeModalPanel("report_session");
        showMessage("page_body", "Error", "Failed to submit report. (" + o.message + ")");
    };


    // Pass the checkbox name to the function
    this.getCheckedBoxes = function (chkboxName) {
        var checkboxes = document.getElementsByName(chkboxName);
        var checkboxesChecked = [];
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
            // And stick the checked ones onto an array...
            if (checkboxes[i].checked) {
                checkboxesChecked.push(checkboxes[i]);
            }
        }
        // Return the array if it is non-empty, or null
        return checkboxesChecked.length > 0 ? checkboxesChecked : null;
    };

    this.retrieveSnapshots = function () {

        this.snapshotCallback = {
            success: this.handleSnapshotLoad,
            failure: function (o) {
                closeModalPanel("load_snapshots");
                showMessage("page_body", "Error", "Failed to load snapshots. (" + o.message + ")");
            },
            cache: false, // Turn off caching for IE
            scope: this
        };

        openModalPanel("load_snapshots", "Loading snapshots");

        YAHOO.util.Connect.asyncRequest('GET', serverRoot + "/data/services/pii" + this.source + "/snapshots?format=json&XNAT_CSRF=" + csrfToken, this.snapshotCallback, null, this);

    }
    this.handleSnapshotLoad = function (o) {
        this.snapshots = [];
        var snapshotResults = eval("(" + o.responseText + ")");
        for (var pC = 0; pC < snapshotResults.ResultSet.Result.length; pC++) {
            this.snapshots.push(snapshotResults.ResultSet.Result[pC]);
        }


        var snapshot_results = "<DIV id=\"snapshot_results\"><div>";


        jq('#dicom_popupbody').append(snapshot_results);

        var snapshot_results = jq("#snapshot_results");
        jq.each(this.snapshots, function () {
            snapshot_results.append("<img width=\"400\" src=\"" + this.URI + "?format=image/jpeg\"/>");
        });


        closeModalPanel("load_snapshots");
    }

    var snapshotFormatter = function (elCell, oRecord, oColumn, oData) {
        var uri = oRecord.getData('URI')
        elCell.innerHTML = "<img width=\"600\" src=\"" + uri + "?format=image/jpeg\"/>"
    };

    var pdfFormatter = function (elCell, oRecord, oColumn, oData) {
        var uri = oRecord.getData('URI')
        var name = oRecord.getData('Name')
        elCell.innerHTML = '<object data="' + serverRoot + uri + '" type="application/pdf" width="780px" height="600px" ' +
            'typemustmatch>' +
            'Unable to render, please <a href="' + serverRoot + uri + '">download ' + name + '</a> and review' +
            '</object>';
        window.PIIManager.pdfs.push(uri);
    };


    function prependLoader(div_id, msg) {
        if (div_id.id == undefined) {
            var div = document.getElementById(div_id);
        } else {
            var div = div_id;
        }
        var loader_div = document.createElement("div");
        loader_div.innerHTML = msg;
        div.parentNode.insertBefore(loader_div, div);
        return new XNATLoadingGIF(loader_div);
    }

    function getResource(uri) {
        return uri.replace(/.*\/resources\//, '')
            .replace(/\/files\/.*/, '');
    }
}