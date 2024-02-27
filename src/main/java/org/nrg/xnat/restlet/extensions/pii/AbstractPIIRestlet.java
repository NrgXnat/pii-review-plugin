package org.nrg.xnat.restlet.extensions.pii;

import org.nrg.xdat.model.XnatImagesessiondataI;
import org.nrg.xft.security.UserI;
import org.nrg.xnat.helpers.prearchive.PrearcTableBuilder;
import org.nrg.xnat.helpers.prearchive.PrearcUtils;
import org.nrg.xnat.restlet.resources.SecureResource;
import org.restlet.Context;
import org.restlet.data.Request;
import org.restlet.data.Response;

import java.io.File;

public abstract class AbstractPIIRestlet extends SecureResource {
    protected String _project;
    protected String _experiment;
    protected String _timestamp;

    public AbstractPIIRestlet(Context context, Request request, Response response) {
        super(context, request, response);
    }

    protected XnatImagesessiondataI retrieveSession(UserI user) throws Exception {
        File sessionDIR = PrearcUtils.getPrearcSessionDir(user, _project, _timestamp, _experiment, false);
        File srcXML = new File(sessionDIR.getAbsolutePath() + ".xml");
        return PrearcTableBuilder.parseSession(srcXML);
    }
}
