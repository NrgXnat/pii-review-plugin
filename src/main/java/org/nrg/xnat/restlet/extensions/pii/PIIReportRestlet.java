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
import org.nrg.xdat.turbine.utils.AdminUtils;
import org.nrg.xnat.restlet.XnatRestlet;
import org.nrg.xnat.restlet.resources.SecureResource;
import org.restlet.Context;
import org.restlet.data.MediaType;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;
import org.restlet.resource.Variant;


@XnatRestlet(value = {"/services/pii/report"})
public final class PIIReportRestlet extends SecureResource {

    private static final Log _log = LogFactory.getLog(PIIReportRestlet.class);

	

	public PIIReportRestlet(Context context, Request request, Response response) {
		super(context, request, response);
        this.getVariants().add(new Variant(MediaType.ALL));

	
	}
	@Override public void handlePost(){
	       String notes = SecureResource.getQueryVariable("notes", getRequest());
	       String tags = SecureResource.getQueryVariable("tags", getRequest());
	       
	      
	       if((tags != null) && (!tags.equals(""))){ 
	          try{
	             String message="Dear Admin, <br>The following personally identifiable information(PII) tags have been found in preachive data. Please add them to the anonymization script and notify the user when they can reattempt upload.<br>";
	             message=message+"<br>Tags: "+ tags;
	             message=message+"<br>Notes: "+ notes;
	             message =message+"<br> "+this.getUser().getFirstname() +" "+ this.getUser().getLastname();

	             AdminUtils.sendAdminEmail("PII found in prearchive", message);
	             // Send email and log request.
	          }
	         
	          catch(Exception e) { 
	             this.getResponse().setStatus(Status.SERVER_ERROR_INTERNAL, "Unable to send Email.");
	          }
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