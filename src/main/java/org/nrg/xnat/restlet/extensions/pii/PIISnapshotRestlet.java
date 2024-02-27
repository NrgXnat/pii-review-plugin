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

import java.io.File;
import java.io.IOException;
import java.util.Hashtable;
import java.util.List;

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
import org.restlet.resource.Representation;
import org.restlet.resource.Variant;


@XnatRestlet(value = {"/services/pii/prearchive/projects/{PROJECT_ID}/{TIMESTAMP}/{EXPT_ID}/snapshots"})
public final class PIISnapshotRestlet extends AbstractPIIRestlet {

    private static final Log _log = LogFactory.getLog(PIISnapshotRestlet.class);

	private static final String imageType = "DICOM";
	private static final int MAXFILENUMBER = 10000;
	XnatImagesessiondataI _session;
	String _root;
	private static final String[] columns = { "Name","Size", "URI","id" };

	public PIISnapshotRestlet(Context context, Request request, Response response) {
		super(context, request, response);

		//test
		_project = (String) getParameter(request, "PROJECT_ID");
		_experiment = (String) getParameter(request, "EXPT_ID");
		_timestamp = (String) getParameter(request, "TIMESTAMP");
		
		getVariants().add(new Variant(MediaType.APPLICATION_JSON));
		getVariants().add(new Variant(MediaType.TEXT_HTML));
		getVariants().add(new Variant(MediaType.TEXT_XML));
		_log.info("Initializing... ");
	}
	private void add(XFTTable t, final XDATUser user) throws Exception {
		this.add(t, user, 1);
		return;
	}

	private void addAll(XFTTable t, XDATUser user) throws Exception {
		this.add(t, user, MAXFILENUMBER);
		return;
	}

	private void add(XFTTable t, UserI user, int enough) throws Exception {
		final XnatImagesessiondataI x = retrieveSession(user);
		// final Object scanID = _scanid;
		for (final XnatImagescandataI scan : x.getScans_scan()) {
			final List<XnatAbstractresourceI> resources = scan.getFile();
			this.addMatchingFile(t, x,scan.getId(), resources, enough);
		}
		return;
	}

	private String constructURI(String project,String timestamp,String experiment,String scan,String type,String resource) {
		String uri = this.getHttpServletRequest().getServletPath() + "/prearchive/projects/"+project+"/"+timestamp+"/"+experiment+"/scans/"+scan+ "/resources/"+type+"/files/" + resource;
				
		return uri;

	}

	private void addMatchingFile(XFTTable t, XnatImagesessiondataI x,String scanId, final List<XnatAbstractresourceI> resources,
			final int enough) {
		String project = x.getProject();
		for (XnatAbstractresourceI r : resources) {
			if (!(r instanceof XnatResourcecatalogI)) {
				continue;
			}
			XnatResourcecatalogI resource = (XnatResourcecatalogI) r;
			final String type = resource.getLabel();
			if (type.equals(PIISnapshotRestlet.imageType)) {
				CatalogUtils.CatalogData catalogData;
				try {
					catalogData = CatalogUtils.CatalogData.getOrCreateAndClean(x.getPrearchivepath(), resource,
							false, project);
				} catch (ServerException e) {
					logger.warn("Unable to ready catalog data for resource " +  resource.getXnatAbstractresourceId());
					continue;
				}
				int totalmatch = 0;
				for (CatEntryI match : catalogData.catBean.getEntries_entry()) {
					File f = CatalogUtils.getFile(match, catalogData.catPath, catalogData.project);
					if (f == null) {
						continue;
					}
					totalmatch = totalmatch + 1;
					Object[] oarray = new Object[] { f.getName(), f.length(), constructURI(_project,_timestamp,_experiment,scanId,type,match.getUri()),scanId };
					t.insertRow(oarray);
					if (totalmatch >= enough) {logger.info("break");
						break;
					}
				}
			}
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
		// do stuff here
		final MediaType mt = overrideVariant(variant);
		XFTTable t = new XFTTable();
		t.initTable(columns);
		try {
			this.add(t, this.getUser(), 1);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return representTable(t, mt, new Hashtable<String, Object>());

	}
}