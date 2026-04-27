package com.carriokay.service;

import com.carriokay.model.Counsellor;
import java.util.List;

public interface CounsellorService {

    Counsellor addCounsellor(Counsellor c);

    List<Counsellor> getAllCounsellors();

    Counsellor updateCounsellor(Long id, Counsellor c);

    void deleteCounsellor(Long id);
}