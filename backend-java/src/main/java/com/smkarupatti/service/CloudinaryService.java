package com.smkarupatti.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map upload(MultipartFile file, String folder) throws IOException {
        Map params = ObjectUtils.asMap(
                "folder", folder,
                "transformation", "w_1000,h_1000,c_limit,q_auto,f_auto"
        );
        return cloudinary.uploader().upload(file.getBytes(), params);
    }

    public Map delete(String publicId) throws IOException {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
