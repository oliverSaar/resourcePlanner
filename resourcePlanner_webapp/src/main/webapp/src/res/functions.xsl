<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- Percentage -->
    <xsl:template name="to-percent">
        <xsl:param name="numerator"/>
        <xsl:param name="denominator"/>
        <xsl:value-of select="$numerator div $denominator * 100"/> 
    </xsl:template>
</xsl:stylesheet>