/*
 * org.nrg.xnat.restlet.extensions.DicomSnapshotRestlet
 * XNAT http://www.xnat.org
 * Copyright (c) 2016, Washington University School of Medicine
 * All Rights Reserved
 *
 * Released under the Simplified BSD.
 *
 * Last modified 1/3/14 9:54 AM
 */
package org.nrg.xnat.restlet.extensions.pii;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nrg.xdat.XDAT;
import org.nrg.xdat.model.XnatImagesessiondataI;
import org.nrg.xdat.turbine.utils.AdminUtils;
import org.nrg.xft.security.UserI;
import org.nrg.xnat.helpers.prearchive.PrearcUtils;
import org.nrg.xnat.helpers.uri.URIManager;
import org.nrg.xnat.restlet.XnatRestlet;
import org.nrg.xnat.restlet.resources.SecureResource;
import org.restlet.Context;
import org.restlet.data.MediaType;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;
import org.restlet.resource.Variant;

import java.net.MalformedURLException;
import java.util.Map;

@XnatRestlet(value = {"/services/pii/pdf_report"})
public final class PIIPdfReportRestlet extends AbstractPIIRestlet {

    private static final Log _log = LogFactory.getLog(PIIPdfReportRestlet.class);

    public PIIPdfReportRestlet(Context context, Request request, Response response) {
        super(context, request, response);
        this.getVariants().add(new Variant(MediaType.ALL));
    }

    @Override
    public void handlePost() {
        String siteUrl = XDAT.getSiteUrl();
        UserI user = this.getUser();
        String notes = SecureResource.getQueryVariable("notes", getRequest());
        String source = SecureResource.getQueryVariable("source", getRequest());
        String pdfs = SecureResource.getQueryVariable("pdfs", getRequest());

        if (pdfs == null) {
            getResponse().setStatus(Status.CLIENT_ERROR_BAD_REQUEST, "Invalid pdfs parameter");
            return;
        }

        Map<String, Object> props;
        try {
            props = PrearcUtils.parseURI(source);
        } catch (MalformedURLException e) {
            getResponse().setStatus(Status.CLIENT_ERROR_BAD_REQUEST, "Invalid source parameter");
            return;
        }

        _project    = (String) props.get(URIManager.PROJECT_ID);
        _timestamp  = (String) props.get(PrearcUtils.PREARC_TIMESTAMP);
        _experiment = (String) props.get(PrearcUtils.PREARC_SESSION_FOLDER);

        XnatImagesessiondataI imageSession;
        try {
            imageSession = retrieveSession(user);
        } catch (Exception e) {
            _log.error("Session not in prearchive", e);
            getResponse().setStatus(Status.CLIENT_ERROR_BAD_REQUEST, "Session not in prearchive: " + e.getMessage());
            return;
        }

        try {
            String message = "<p>Dear " + XDAT.getSiteId() + " admin,</p>" +
                    "<p>PDF file(s) uploaded with a prearchive session were deleted due to personally identifiable information (PII). " +
                    "The session (which did not, itself, contain PII) is currently in the " +
                    "<a href=\"" + siteUrl + "/data" + source + "?screen=PrearchiveDetails.vm\">prearchive</a>, " +
                    "but it may be archived at any time (the PDF(s) that contained PII have been removed).</p>" +
                    "<p>Session information:</p>" +
                    "<ul>" +
                    "<li>Project: " + imageSession.getProject() + "</li>" +
                    "<li>Subject: " + imageSession.getSubjectId() + "</li>" +
                    "<li>Session: " + imageSession.getLabel() + "</li>" +
                    "</ul>" +
                    "<p>Once the session is archived, the deidentified PDF(s) should be reuploaded with " +
                    "\"Upload Additional Files\".</p>" +
                    "<p><strong>PDF(s) removed:</strong> " + pdfs + "</p>" +
                    "<p><strong>Reporter:</strong> " + user.getFirstname() + " " + user.getLastname() + " (" + user.getEmail()+ ")</p>" +
                    "<p><strong>Reporter comments:</strong> " + notes + "</p>" +
                    "<p>Thanks!</p>";

            AdminUtils.sendAdminEmail("PII in prearchive PDF(s)", message);
        } catch (Exception e) {
            this.getResponse().setStatus(Status.SERVER_ERROR_INTERNAL, "Unable to send email.");
        }
    }


    @Override
    public boolean allowGet() {
        return false;
    }

    @Override
    public boolean allowPost() {
        return true;
    }

    @Override
    public boolean allowPut() {
        return false;
    }

    @Override
    public boolean allowDelete() {
        return false;
    }


}