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

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nrg.action.ServerException;
import org.nrg.xdat.model.*;
import org.nrg.xdat.security.XDATUser;
import org.nrg.xft.XFTTable;
import org.nrg.xft.exception.InvalidPermissionException;
import org.nrg.xft.security.UserI;
import org.nrg.xnat.helpers.prearchive.PrearcTableBuilder;
import org.nrg.xnat.helpers.prearchive.PrearcUtils;
import org.nrg.xnat.restlet.XnatRestlet;
import org.nrg.xnat.restlet.resources.SecureResource;
import org.nrg.xnat.utils.CatalogUtils;
import org.restlet.Context;
import org.restlet.data.MediaType;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;
import org.restlet.resource.Representation;
import org.restlet.resource.Variant;

import java.io.File;
import java.io.IOException;
import java.util.Hashtable;
import java.util.List;


@XnatRestlet(value = {"/services/pii/prearchive/projects/{PROJECT_ID}/{TIMESTAMP}/{EXPT_ID}/pdf"})
public final class PIIPdfRestlet extends AbstractPIIRestlet {

    private static final Log _log = LogFactory.getLog(PIIPdfRestlet.class);
	private static final String[] columns = { "Name", "URI" };

	public PIIPdfRestlet(Context context, Request request, Response response) {
		super(context, request, response);

		_project = (String) getParameter(request, "PROJECT_ID");
		_experiment = (String) getParameter(request, "EXPT_ID");
		_timestamp = (String) getParameter(request, "TIMESTAMP");
		
		getVariants().add(new Variant(MediaType.APPLICATION_JSON));
		getVariants().add(new Variant(MediaType.TEXT_HTML));
		getVariants().add(new Variant(MediaType.TEXT_XML));
	}

	private void add(XFTTable t, UserI user) throws Exception {
		final XnatImagesessiondataI x = retrieveSession(user);
		for (final XnatAbstractresourceI resource : x.getResources_resource()) {
			if (resource instanceof XnatResourcecatalogI) {
				this.addMatchingFile(t, x, (XnatResourcecatalogI) resource);
			}
		}
	}

	private String constructURI(String label, String filepath) {
		return this.getHttpServletRequest().getServletPath() +
				"/prearchive/projects/" + _project + "/" + _timestamp + "/" + _experiment + "/resources/" +
				label + "/files/" + filepath;
	}

	private void addMatchingFile(XFTTable t, XnatImagesessiondataI x, XnatResourcecatalogI resource) {
		String project = x.getProject();
		CatalogUtils.CatalogData catalogData;
		try {
			catalogData = CatalogUtils.CatalogData.getOrCreateAndClean(x.getPrearchivepath(), resource,
					false, project);
		} catch (ServerException e) {
			_log.warn("Unable to ready catalog data for resource " +  resource.getXnatAbstractresourceId());
			return;
		}
		for (CatEntryI match : catalogData.catBean.getEntries_entry()) {
			File f = CatalogUtils.getFile(match, catalogData.catPath, catalogData.project);
			if (f == null || !FilenameUtils.getExtension(f.getName()).equals("pdf")) {
				continue;
			}
			t.insertRow(new Object[]{ f.getName(), constructURI(resource.getLabel(), match.getUri()) });
		}
	}
	
	@Override
	public boolean allowGet() {
		return true;
	}
	@Override
	public boolean allowPost() {
		return false;
	}
	@Override
	public boolean allowPut() {
		return false;
	}

	public Representation represent(final Variant variant) {
		final MediaType mt = overrideVariant(variant);
		XFTTable t = new XFTTable();
		t.initTable(columns);
		try {
			this.add(t, this.getUser());
		} catch (Exception e) {
			_log.error("Unable to list pdfs", e);
			getResponse().setStatus(Status.SERVER_ERROR_INTERNAL, "Unable to list pdfs");
			return null;
		}
		return representTable(t, mt, new Hashtable<String, Object>());
	}
}