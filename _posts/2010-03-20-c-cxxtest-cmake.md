---
title: c++, cxxtest, cmake
author: Adam Stokes
layout: post
permalink: /c-cxxtest-cmake/
categories:
  - "What's New"
---
Been messing around lately with CMake and how to intregrate  
additional testing frameworks such as CxxTest. So far everything  
has been very simple to configure and get setup so I thought  
I'd post my findings here.

  * Fedora provides both cmake and cxxtest so install these first.
  * CMake provides a convenience macro called FindCxxTest.cmake
  * In your CMakeLists.txt append the following:<pre class="prettyprint"> # cxxtest find\_package(CxxTest) if(CXXTEST\_FOUND) set(CXXTEST\_USE\_PYTHON TRUE) include\_directories(${CXXTEST\_INCLUDE\_DIR}) enable\_testing() CXXTEST\_ADD\_TEST(unittest\_sos check\_sos.cpp ${SOS\_TEST\_PATH}/check\_sos.h) target\_link\_libraries(unittest\_sos sos) endif() </pre> 

The only custom variable here is SOS\_TEST\_PATH which basically points to $HOME/sos/tests/check_sos.h. See the 'set' function in the cmake documentation.  
This is really all you need to do here. One note is to set the  
CXXTEST\_USE\_PYTHON to TRUE b/c cmake provided in Fedora doesn't  
contain the perl version of the test generator. I'm not going  
to post how I setup the testcases b/c right now they are very simple,  
however, if you would like to use my project as an example for implementing  
cmake into your code have a look at: libsos

If anyone has any good information on using cmake with python build scripts I'd love to see those. For RPM Builders the spec file was very simple. I used  
the syntax within the kde builds:<pre class="prettyprint"> %build mkdir -p %{\_target\_platform} pushd %{\_target\_platform} cmake .. popd make %{?\_smp\_mflags} -C %{\_target\_platform} %install rm -rf $RPM\_BUILD\_ROOT make -C %{\_target\_platform} install DESTDIR=$RPM\_BUILD\_ROOT %clean rm -rf $RPM\_BUILD\_ROOT %post -p /sbin/ldconfig %postun -p /sbin/ldconfig %files %defattr(-,root,root,-) %doc %{\_libdir}/%{name}.so.\* %files devel %defattr(-,root,root,-) %doc %{\_includedir}/%{name} %{\_libdir}/%{name}.so\* %{\_libdir}/pkgconfig/%{name}.pc </pre> 

Hope this little bit will help others who are interested in cmake.